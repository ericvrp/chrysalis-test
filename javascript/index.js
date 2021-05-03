require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs

//
let client = new ClientBuilder();
if (process.env.IOTA_NETWORK) client = client.network(process.env.IOTA_NETWORK);
if (process.env.IOTA_NODE) client = client.node(process.env.IOTA_NODE);
client = client.build();

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

  for (let accountIndex = 0; accountIndex < nAccounts; accountIndex++) {
    client
      .getBalance(seed)
      .accountIndex(accountIndex)
      .initialAddressIndex(0)
      .get()
      .then(async (balance) => {
        if (!balance) return;
        console.log(`Balance of account #${accountIndex} is ${balance} IOTA`);
      })
      .catch(console.error);

    client
      .getAddresses(seed)
      .accountIndex(accountIndex)
      .range(0, 20)
      .get()
      .then((addresses) => {
        for (const addressIndex in addresses) {
          const address = addresses[addressIndex];
          client.getAddressBalance(address).then((addressBalance) => {
            if (!addressBalance?.balance) return;
            console.log(
              `Address #${addressIndex} of account #${accountIndex} has balance ${
                addressBalance.balance
              } (${
                addressBalance.dust_allowed ? "dust allowed" : "no dust allowed"
              })`
            );
          });
        }
      })
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
          `https://explorer.iota.org/${process.env.IOTA_NETWORK}/indexed/${spamMessageIndex} (${lastMessagesPerSecond} MPS)`
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
      `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${
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
  console.log(
    `\n= = = Connected to ${
      (await client.getInfo()).nodeinfo.networkId
    } = = =\n`
  );

  /*await*/ showBalances();
  // /*await*/ dataSpam();
  // /*await*/ valueSpam();
};

main().then().catch(console.error);
