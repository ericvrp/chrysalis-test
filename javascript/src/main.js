require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs
const { mqtt } = require("./mqtt");
const { consolidator } = require("./consolidator");
const { showBalances } = require("./showBalances");
const { getInfo } = require("./getInfo");
const { dataSpam } = require("./dataSpam");
const { valueSpam } = require("./valueSpam");
const { NODE } = require("./constants");

const argv = require("yargs/yargs")(process.argv.slice(2)) // https://yargs.js.org and https://github.com/yargs/yargs/blob/master/docs/examples.md
  .default("mqtt", true)
  .default("showbalances", true)
  .default("showbalances-interval", 300)
  .default("valuespam", true)
  .default("valuespam-interval", 10)
  .default("dataspam", true)
  .default("dataspam-interval", 0)
  .default("getinfo", true)
  .default("getinfo-interval", 120)
  .default("consolidator", true)
  .default("consolidator-interval", 60)
  .default("network", "mainnet")
  .default("messageIndex", "chrysalis-test")
  .default("accountIndexWithDustAllowance", 1)
  .default("nAccounts", 2).argv;
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
    consolidator(argv, client, seed);
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

  if (argv.getinfo) {
    getInfo(argv, client);
  }

  if (argv.mqtt) {
    mqtt(argv, client);
  }
};

main()
  .then((result) => result && console.log(result))
  .catch((err) => console.error(err.message));
