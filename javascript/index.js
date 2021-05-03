require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");

const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs

const NETWORK = "mainnet";
const NODE = "https://chrysalis-nodes.iota.org";

const N_ACCOUNTS = 2;

const main = async () => {
  console.log(
    "--------------------------------------------------------------------------------"
  );

  const client = new ClientBuilder().network(NETWORK).node(NODE).build();

  // const seed1 = await mnemonicToEntropy(process.env.IOTA_MNEMONIC);
  const mnemonic = process.env.IOTA_MNEMONIC;
  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");
  // console.log("seed", seed);

  for (let account = 0; account < N_ACCOUNTS; account++) {
    const balance = await client
      .getBalance(seed)
      .accountIndex(account)
      .initialAddressIndex(0)
      .get();
    console.log(`balance #${account} is ${balance} IOTA`);
  }

  const MESSAGE_INDEX = "BC030";
  let lastMessagesPerSecond = 0.0;

  for (;;) {
    const info = await client.getInfo();
    if (lastMessagesPerSecond != info.nodeinfo.messagesPerSecond) {
      lastMessagesPerSecond = info.nodeinfo.messagesPerSecond;
      console.log(
        `https://explorer.iota.org/${NETWORK}/indexed/${MESSAGE_INDEX} (${lastMessagesPerSecond} MPS on ${NETWORK})`
      );
    }

    const message = await client
      .message()
      .index(MESSAGE_INDEX)
      .data("Hallo BC030!!!")
      .submit();
    console.log(
      `https://explorer.iota.org/${NETWORK}/message/${message.messageId}`
    );

    break;
  }

  // setTimeout(main, 10 * 1000);
};

main().then().catch(console.error);
