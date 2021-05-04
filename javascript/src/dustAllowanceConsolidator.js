const {
  ONE_MIOTA,
  ADDRESS_WITH_ALLOWANCE,
  ACCOUNTINDEX_WITH_ALLOWANCE,
  DUSTALLOWANCE_REFRESH_INTERVAL,
} = require("./constants");

const dustAllowanceConsolidator = async (
  client,
  seed,
  allowance = ONE_MIOTA,
  consolidateThreshold = 0.7
) => {
  client
    .getAddressBalance(ADDRESS_WITH_ALLOWANCE)
    .then(async (addressBalance) => {
      // console.log(addressBalance);

      if (addressBalance.balance < allowance) {
        client
          .message()
          .seed(seed)
          .dustAllowanceOutput(
            ADDRESS_WITH_ALLOWANCE,
            allowance - addressBalance.balance
          )
          .submit()
          .then(() =>
            console.log(`Added ${allowance - addressBalance.balance} allowance`)
          )
          .catch(console.error);
      }

      client
        .findOutputs([], [ADDRESS_WITH_ALLOWANCE])
        .then(async (outputs) => {
          const consolidateThresholdCount =
            Math.min(
              Math.floor(addressBalance.balance / ONE_MIOTA) *
                10 *
                consolidateThreshold,
              100
            ) + 1; // +1 for the original dust protection allowance

          if (outputs.length >= consolidateThresholdCount) {
            console.log("Consolidating allowance...");

            let consolidateMessage = client
              .message()
              .seed(seed)
              .accountIndex(ACCOUNTINDEX_WITH_ALLOWANCE);
            for (const output of outputs) {
              consolidateMessage = consolidateMessage.input(
                output.transactionId,
                output.outputIndex
              );
            }
            consolidateMessage
              .dustAllowanceOutput(
                ADDRESS_WITH_ALLOWANCE,
                addressBalance.balance
              )
              .submit()
              .then(() => console.log(`Consolidated allowance`))
              .catch(console.error);
          } else {
            console.log(
              `Still ${
                consolidateThresholdCount - outputs.length
              } outputs left before consolidation`
            );
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
