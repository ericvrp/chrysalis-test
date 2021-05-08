const {
  ONE_MIOTA,
  CONSOLIDATOR_REFRESH_INTERVAL,
  MESSAGE_INDEX,
  ACCOUNTINDEX_WITH_ALLOWANCE,
  ADDRESS_WITH_ALLOWANCE,
} = require("./constants");

const consolidator = async (
  argv,
  client,
  seed,
  allowance = ONE_MIOTA,
  consolidateThreshold = 0.7,
  forceConsolidation = true
) => {
  const addressWithAllowance = ADDRESS_WITH_ALLOWANCE[argv.network];

  client
    .getAddressBalance(addressWithAllowance)
    .then(async (addressBalance) => {
      // console.log(addressBalance);

      if (addressBalance.balance < allowance) {
        client
          .message()
          .index(MESSAGE_INDEX)
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
          .submit()
          .then(() =>
            console.log(`Added ${allowance - addressBalance.balance} allowance`)
          )
          .catch(console.error);
      }

      client
        .findOutputs([], [addressWithAllowance])
        .then(async (outputs) => {
          const consolidateThresholdCount =
            Math.min(
              Math.floor(addressBalance.balance / ONE_MIOTA) *
                10 *
                consolidateThreshold,
              100
            ) + 1; // +1 for the original dust protection allowance

          if (
            forceConsolidation ||
            outputs.length >= consolidateThresholdCount
          ) {
            // console.log(
            //   `https://explorer.iota.org/mainnet/addr/${addressWithAllowance} (consolidating allowance)`
            // );

            let consolidateMessage = client
              .message()
              .index(MESSAGE_INDEX)
              .data(
                `consolidate ${
                  outputs.length
                } outputs @${new Date().toISOString()}`
              )
              .seed(seed)
              .accountIndex(parseInt(ACCOUNTINDEX_WITH_ALLOWANCE));
            for (const output of outputs) {
              consolidateMessage = consolidateMessage.input(
                output.transactionId,
                output.outputIndex
              );
            }
            consolidateMessage
              .dustAllowanceOutput(addressWithAllowance, addressBalance.balance)
              .submit()
              .then(() =>
                console.log(
                  `https://explorer.iota.org/mainnet/addr/${addressWithAllowance}    (consolidated ${outputs.length} outputs)`
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
      dustAllowanceConsolidator(
        client,
        seed,
        allowance,
        consolidateThreshold,
        false
      ),
    CONSOLIDATOR_REFRESH_INTERVAL
  );
};

module.exports = { consolidator };
