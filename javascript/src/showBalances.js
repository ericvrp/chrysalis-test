const { sleepSeconds, throttle } = require("./utils");

const showBalances = async (
  argv,
  client,
  seed,
  balances = [],
  showDetails = false
) => {
  // console.log("showBalances");

  // testnet faucet https://faucet.testnet.chrysalis2.com and https://faucet.tanglekit.de/
  for (let accountIndex = 0; accountIndex < argv.nAccounts; accountIndex++) {
    const addresses = await client
      .getAddresses(seed)
      .accountIndex(accountIndex)
      .range(0, 1)
      .get();
    console.log(`Account #${accountIndex} starts with address ${addresses[0]}`);
  }

  for (;;) {
    try {
      let balanceChanged = false;

      for (
        let accountIndex = 0;
        accountIndex < argv.nAccounts;
        accountIndex++
      ) {
        const balance = await client
          .getBalance(seed)
          .accountIndex(accountIndex)
          .initialAddressIndex(0)
          .get();

        if (balance !== balances[accountIndex]) balanceChanged = true;

        balances[accountIndex] = balance;

        if (showDetails) {
          const addresses = await client
            .getAddresses(seed)
            .accountIndex(accountIndex)
            .range(0, 20)
            // .include_internal()
            .get();

          for (const addressIndex in addresses) {
            const address = addresses[addressIndex];
            client.getAddressBalance(address).then((addressBalance) => {
              if (!addressBalance.balance) return;
              console.log(
                `Address #${addressIndex} of account #${accountIndex} (${address}) has balance ${
                  addressBalance.balance
                } (${
                  addressBalance.dust_allowed
                    ? "dust allowed"
                    : "no dust allowed"
                })`
              );
            });
          }
        }
      } // next accountIndex

      if (balanceChanged) {
        console.log(
          `${balances.reduce((t, v) => t + v)} IOTA in total (${balances.join(
            "+"
          )})`
        );
      }
    } catch (err) {
      console.error(err.message);
      await throttle();
    }

    await sleepSeconds(argv["showbalances-interval"]);
  }
};

module.exports = { showBalances };
