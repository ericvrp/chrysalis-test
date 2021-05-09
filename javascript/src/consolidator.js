const { ONE_MIOTA, ADDRESS_WITH_ALLOWANCE } = require("./constants");
const { sleepSeconds, throttle } = require("./utils");

const consolidator = async (
  argv,
  client,
  seed,
  allowance = ONE_MIOTA,
  consolidateThreshold = 0.7,
  forceConsolidation = true
) => {
  !argv.quiet && console.log("consolidator");

  const addressWithAllowance = ADDRESS_WITH_ALLOWANCE[argv.network];

  for (; ; forceConsolidation = false) {
    try {
      const addressBalance = await client.getAddressBalance(
        addressWithAllowance
      );
      // console.log(addressBalance);

      if (addressBalance.balance < allowance) {
        await client
          .message()
          .index(argv.messageIndex)
          .data(
            `add ${
              allowance - addressBalance.balance
            }i allowance @${new Date().toISOString()}`
          )
          .seed(seed)
          .dustAllowanceOutput(
            addressWithAllowance,
            allowance - addressBalance.balance
          )
          .submit();

        console.log(`Added ${allowance - addressBalance.balance} allowance`);
      }

      const outputs = await client.findOutputs([], [addressWithAllowance]);

      const consolidateThresholdCount =
        Math.min(
          Math.floor(addressBalance.balance / ONE_MIOTA) *
            10 *
            consolidateThreshold,
          100
        ) + 1; // +1 for the original dust protection allowance

      if (
        outputs.length > 1 &&
        (forceConsolidation || outputs.length >= consolidateThresholdCount)
      ) {
        !argv.quiet &&
          console.log(
            `https://explorer.iota.org/mainnet/addr/${addressWithAllowance} (consolidating allowance)`
          );

        let consolidateMessage = client
          .message()
          .index(argv.messageIndex)
          .data(
            `consolidate ${outputs.length} outputs @${new Date().toISOString()}`
          )
          .seed(seed)
          .accountIndex(parseInt(argv.accountIndexWithDustAllowance));
        for (const output of outputs) {
          consolidateMessage = consolidateMessage.input(
            output.transactionId,
            output.outputIndex
          );
        }
        await consolidateMessage
          .dustAllowanceOutput(addressWithAllowance, addressBalance.balance)
          .submit();

        console.log(
          `https://explorer.iota.org/mainnet/addr/${addressWithAllowance}    (consolidated ${outputs.length} outputs)`
        );
      } else {
        !argv.quiet &&
          console.log(
            `Still ${
              consolidateThresholdCount - outputs.length
            } outputs left before consolidation`
          );
      }
    } catch (err) {
      console.error(err.message);
      await throttle();
    }

    await sleepSeconds(argv["consolidator-interval"]);
  }
};

module.exports = { consolidator };
