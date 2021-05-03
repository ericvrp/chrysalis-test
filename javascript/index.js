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

  const mnemonic = process.env.IOTA_MNEMONIC;
  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");

  for (let account = 0; account < N_ACCOUNTS; account++) {
    client
      .getBalance(seed)
      .accountIndex(account)
      .initialAddressIndex(0)
      .get()
      .then(
        (balance) =>
          balance && console.log(`Balance #${account} is ${balance} IOTA`)
      )
      .catch(console.error);
  }

  const MESSAGE_INDEX = "BC030";
  let lastMessagesPerSecond = 0;

  for (;;) {
    client.getInfo().then((info) => {
      // console.log(info);
      if (
        lastMessagesPerSecond != Math.round(info.nodeinfo.messagesPerSecond)
      ) {
        lastMessagesPerSecond = Math.round(info.nodeinfo.messagesPerSecond);
        console.log(
          `https://explorer.iota.org/${NETWORK}/indexed/${MESSAGE_INDEX} (${lastMessagesPerSecond} MPS)`
        );
      }
    });

    const message = await client
      .message()
      .index(MESSAGE_INDEX)
      .data(
        `Hallo BC030 vanuit Javascript!!! (om ${new Date().toISOString()} bij ${lastMessagesPerSecond} MPS)`
      )
      .submit();
    console.log(
      `https://explorer.iota.org/${NETWORK}/message/${message.messageId}`
    );
  }

  // setTimeout(main, 10 * 1000);
};

main().then().catch(console.error);
