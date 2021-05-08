require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs
const { mqtt } = require("./mqtt");
const { dustAllowanceConsolidator } = require("./dustAllowanceConsolidator");
const { showBalances } = require("./showBalances");
const { dataSpam } = require("./dataSpam");
const { valueSpam } = require("./valueSpam");
const { ACCOUNTINDEX_WITH_ALLOWANCE, NODE } = require("./constants");

const argv = require("yargs/yargs")(process.argv.slice(2)) // https://yargs.js.org and https://github.com/yargs/yargs/blob/master/docs/examples.md
  .default("mqtt", true)
  .default("showbalances", true)
  .default("valuespam", true)
  .default("dataspam", true)
  .default("consolidator", true)
  .default("network", "mainnet").argv;
// console.log(argv); // --help

//
const main = async () => {
  let client = new ClientBuilder()
    .network(argv.network)
    .node(NODE[argv.network])
    .build();

  const info = await client.getInfo();
  console.log(`\n= = = Connected to ${info.nodeinfo.networkId} = = =\n`);
  // console.log(info);

  const mnemonic = process.env.IOTA_MNEMONIC;

  const seed = (await mnemonicToSeed(mnemonic)).toString("hex");
  // console.log("seed1", seed);

  // const seed2 = client.mnemonicToHexSeed(mnemonic);
  // console.log("seed2", seed2);

  if (argv.consolidator) {
    dustAllowanceConsolidator(argv, client, seed);
  }

  if (argv.showbalances) {
    showBalances(argv, client, seed);
  }

  if (argv.valuespam) {
    valueSpam(argv, client, seed);
  }

  if (argv.dataspam) {
    dataSpam(argv, client);
  }

  if (argv.mqtt) {
    mqtt(argv, client);
  }
};

main()
  .then((result) => result && console.log(result))
  .catch((err) => console.error(err.message));
