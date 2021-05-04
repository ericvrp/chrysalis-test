require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs
const { ONE_MIOTA, ONE_IOTA } = require("./constants");
const { dustAllowanceConsolidator } = require("./dustAllowanceConsolidator");
const { showBalances } = require("./showBalances");
const { dataSpam } = require("./dataSpam");
const { valueSpam } = require("./valueSpam");

const main = async () => {
  let client = new ClientBuilder();
  if (process.env.IOTA_NETWORK)
    client = client.network(process.env.IOTA_NETWORK);
  if (process.env.IOTA_NODE) client = client.node(process.env.IOTA_NODE);
  client = client.build();

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

  dustAllowanceConsolidator(client, seed);
  showBalances(client, seed);
  dataSpam(client);
  valueSpam(client, seed);
};

main()
  .then((result) => result && console.log(result))
  .catch((err) => console.error(err.message));
