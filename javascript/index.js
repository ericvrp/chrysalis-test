require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs

//
const NETWORK = "mainnet";
const NODE = "https://chrysalis-nodes.iota.org";

const client = new ClientBuilder().network(NETWORK).node(NODE).build();

//
const showBalances = async (nAccounts = 2) => {
  const mnemonic = process.env.IOTA_MNEMONIC;
  if (!mnemonic || mnemonic.split(" ").length !== 24) {
    console.warn(
      "Skipping showBalances because IOTA_MNEMONIC is not 24 words as requried by the Chrysalis mainnet"
    );
    return;
  }

  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");

  for (let account = 0; account < nAccounts; account++) {
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
};

//
const dataSpam = async (spamMessageIndex = "BC030") => {
  let lastMessagesPerSecond = 0;

  const startTime = new Date();
  let nSpammedMessages = 0;
  for (;;) {
    client.getInfo().then((info) => {
      // console.log(info);
      if (
        lastMessagesPerSecond != Math.round(info.nodeinfo.messagesPerSecond)
      ) {
        lastMessagesPerSecond = Math.round(info.nodeinfo.messagesPerSecond);
        console.log(
          `https://explorer.iota.org/${NETWORK}/indexed/${spamMessageIndex} (${lastMessagesPerSecond} MPS)`
        );
      }
    });

    const message = await client
      .message()
      .index(spamMessageIndex)
      .data(
        `Hallo BC030 vanuit Javascript!!! (om ${new Date().toISOString()} bij ${lastMessagesPerSecond} MPS)`
      )
      .submit();
    nSpammedMessages++;
    console.log(
      `https://explorer.iota.org/${NETWORK}/message/${
        message.messageId
      } (spamming ${(
        (nSpammedMessages / (new Date() - startTime)) *
        1000
      ).toFixed(2)} MPS data)`
    );
  }
};

//
const main = async () => {
  console.log("--- RESTART ---");
  /*await*/ showBalances();
  /*await*/ dataSpam();
  // /*await*/ valueSpam();
};

main().then().catch(console.error);
