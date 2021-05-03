require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs

//
let client = new ClientBuilder();
if (process.env.IOTA_NETWORK) client = client.network(process.env.IOTA_NETWORK);
if (process.env.IOTA_NODE) client = client.node(process.env.IOTA_NODE);
client = client.build();

//
const sleep = async (ms = 1000) => {
  return new Promise((r) => setTimeout(r, ms));
};

//
const showBalances = async (seed, nAccounts = 2) => {
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
      .catch((err) => console.error(err.message));

    client
      .getAddresses(seed)
      .accountIndex(accountIndex)
      .range(0, 20)
      // .include_internal()
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
      .catch((err) => console.error(err.message));
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
        `Groeten aan BC030! (Transactie verstuurd om ${new Date().toISOString()} bij ${lastMessagesPerSecond} MPS)`
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
const valueSpam = async (seed) => {
  const testAccountIndex = 1;
  const testWalletAddress =
    "iota1qrjqsakhe9fw4t0v84s04jglkf65zrt83h8vggmlxhg5fyq8du04k07dgk9"; // test wallet
  const allowanceAmount = 1000000; // 1Mi

  const testWalletBalance = await client
    .getBalance(seed)
    .accountIndex(testAccountIndex)
    .initialAddressIndex(0)
    .get();

  if (testWalletBalance === 0) {
    const message = await client
      .message()
      .seed(seed)
      .dustAllowanceOutput(testWalletAddress, allowanceAmount)
      .submit();
    console.log(
      `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${message.messageId} (allowance)`
    );

    while (
      (await client
        .getBalance(seed)
        .accountIndex(testAccountIndex)
        .initialAddressIndex(0)
        .get()) === 0
    )
      console.log("Waiting for allowance to arrive");
    await sleep(1000);
  }

  const amount = 1; // 1i
  client
    .message()
    .seed(seed)
    .output(testWalletAddress, amount)
    .submit()
    .then((message) =>
      console.log(
        `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${message.messageId} (1i transaction)`
      )
    )
    .catch((err) => console.error(err.message));
};

//
const main = async () => {
  console.log(
    `\n= = = Connected to ${
      (await client.getInfo()).nodeinfo.networkId
    } = = =\n`
  );

  const mnemonic = process.env.IOTA_MNEMONIC;
  if (!mnemonic || mnemonic.split(" ").length !== 24) {
    console.warn(
      "Skipping showBalances because IOTA_MNEMONIC is not 24 words as requried by the Chrysalis mainnet"
    );
    return;
  }

  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");

  /*await*/ showBalances(seed);
  // /*await*/ dataSpam();
  /*await*/ valueSpam(seed);
};

main()
  .then((result) => result && console.log(result))
  .catch((err) => console.error(err.message));
