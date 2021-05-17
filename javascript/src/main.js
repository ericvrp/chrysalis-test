require("dotenv").config({ path: "../.env" });
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs
const { mqtt } = require("./mqtt");
const { consolidator } = require("./consolidator");
const {
  showInitialAddressPerAccount,
  showBalancesDetails,
  showBalances,
} = require("./showBalances");
const { getInfo } = require("./getInfo");
const { dataSpam } = require("./dataSpam");
const { valueSpam } = require("./valueSpam");
const { NODE, ONE_IOTA, ONE_MIOTA } = require("./constants");

const argv = require("yargs/yargs")(process.argv.slice(2)) // https://yargs.js.org and https://github.com/yargs/yargs/blob/master/docs/examples.md
  .default("quiet", true)
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
  !argv.quiet && console.log(argv);

  let client = new ClientBuilder()
    .network(argv.network)
    .node(NODE[argv.network])
    .build();

  console.log(
    `\n= = = Connected to ${NODE[argv.network]} on ${argv.network} = = =\n`
  );

  console.log(
    `${process.env.IOTA_MNEMONIC.split(" ").length} words in mnemonic`
  );

  const seed = client.mnemonicToHexSeed(process.env.IOTA_MNEMONIC);
  !argv.quiet && console.log(seed);

  const addresses = await client
    .getAddresses(seed)
    .accountIndex(parseInt(argv.accountIndexWithDustAllowance))
    .range(0, 20)
    .get();
  let addressWithAllowance = addresses[0]; // fall back to the initial address when no balance is found
  // console.log(addresses);
  for (const addressIndex in addresses) {
    const address = addresses[addressIndex];
    const addressBalance = await client.getAddressBalance(address);
    if (addressBalance.balance) {
      addressWithAllowance = address;
      break;
    }
  }
  // console.log(addressWithAllowance);

  if (argv.consolidator) {
    consolidator(argv, client, seed, addressWithAllowance, ONE_MIOTA);
  }

  if (argv.showbalances) {
    // showInitialAddressPerAccount(argv, client, seed);
    // showBalancesDetails(argv, client, seed);
    showBalances(argv, client, seed);
  }

  if (argv.valuespam) {
    valueSpam(argv, client, seed, addressWithAllowance, ONE_IOTA);
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
