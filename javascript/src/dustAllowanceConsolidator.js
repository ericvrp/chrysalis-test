const { ONE_MIOTA, DUSTALLOWANCE_REFRESH_INTERVAL } = require("./constants");

const dustAllowanceConsolidator = async (
  client,
  seed,
  allowance = ONE_MIOTA,
  consolidateThreshold = 0.7
) => {
  client
    .getAddressBalance(process.env.IOTA_ADDRESS_WITH_ALLOWANCE)
    .then(async (addressBalance) => {
      // console.log(addressBalance);

      if (addressBalance.balance < allowance) {
        client
          .message()
          .seed(seed)
          .dustAllowanceOutput(
            process.env.IOTA_ADDRESS_WITH_ALLOWANCE,
            allowance - addressBalance.balance
          )
          .submit()
          .then(() =>
            console.log(`Added ${allowance - addressBalance.balance} allowance`)
          )
          .catch(console.error);
      }

      client
        .findOutputs([], [process.env.IOTA_ADDRESS_WITH_ALLOWANCE])
        .then(async (outputs) => {
          const consolidateThresholdCount =
            Math.min(
              Math.floor(addressBalance.balance / ONE_MIOTA) *
                10 *
                consolidateThreshold,
              100
            ) + 1; // +1 for the original dust protection allowance

          if (outputs.length >= consolidateThresholdCount) {
            console.log(
              `https://explorer.iota.org/mainnet/addr/${process.env.IOTA_ADDRESS_WITH_ALLOWANCE} (consolidating allowance)`
            );

            let consolidateMessage = client
              .message()
              .seed(seed)
              .accountIndex(
                parseInt(process.env.IOTA_ACCOUNTINDEX_WITH_ALLOWANCE)
              );
            for (const output of outputs) {
              consolidateMessage = consolidateMessage.input(
                output.transactionId,
                output.outputIndex
              );
            }
            consolidateMessage
              .dustAllowanceOutput(
                process.env.IOTA_ADDRESS_WITH_ALLOWANCE,
                addressBalance.balance
              )
              .submit()
              .then(() =>
                console.log(
                  `https://explorer.iota.org/mainnet/addr/${process.env.IOTA_ADDRESS_WITH_ALLOWANCE} (consolidated allowance)`
                )
              )
              .catch(console.error);
          } else {
            // console.log(
            //   `Still ${
            //     consolidateThresholdCount - outputs.length
            //   } outputs left before consolidation`
            // );
          }
        })
        .catch((err) => console.error(err.message));
    });

  setTimeout(
    () =>
      dustAllowanceConsolidator(client, seed, allowance, consolidateThreshold),
    DUSTALLOWANCE_REFRESH_INTERVAL
  );
};

module.exports = { dustAllowanceConsolidator };
