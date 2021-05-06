require("dotenv").config({ path: "../.env" });
const { mnemonicToSeed } = require("bip39");
const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs
const { mqtt } = require("./mqtt");
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

  const info = await client.getInfo();
  console.log(`\n= = = Connected to ${info.nodeinfo.networkId} = = =\n`);
  // console.log(info);

  if (process.env.IOTA_MQTT !== "true") {
    console.warn("Skipping MQTT");
  } else {
    mqtt(client);
  }

  const mnemonic = process.env.IOTA_MNEMONIC;
  if (!mnemonic || mnemonic.split(" ").length !== 24) {
    console.warn(
      "Skipping code that uses IOTA_MNEMONIC because it's not the required 24-words seedphrase"
    );
  } else {
    const seed = (await mnemonicToSeed(mnemonic)).toString("hex");
    // console.log("seed1", seed);

    // const seed2 = client.mnemonicToHexSeed(mnemonic);
    // console.log("seed2", seed2);

    if (
      !process.env.IOTA_ADDRESS_WITH_ALLOWANCE ||
      !process.env.IOTA_ACCOUNTINDEX_WITH_ALLOWANCE
    ) {
      console.warn("Skipping dustAllowanceConsolidator");
    } else {
      dustAllowanceConsolidator(client, seed);
    }

    showBalances(client, seed);

    if (
      process.env.IOTA_VALUESPAM !== "true" ||
      !process.env.IOTA_ADDRESS_WITH_ALLOWANCE
    ) {
      console.warn("Skipping valueSpam");
    } else {
      valueSpam(client, seed);
    }
  }

  if (process.env.IOTA_DATASPAM !== "true") {
    console.warn("Skipping dataSpam");
  } else {
    dataSpam(client);
  }
};

main()
  .then((result) => result && console.log(result))
  .catch((err) => console.error(err.message));
