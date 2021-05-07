const { BALANCE_REFRESH_INTERVAL, N_ACCOUNTS } = require("./constants");

const showBalances = async (
  client,
  seed,
  balances = [],
  nAccounts = N_ACCOUNTS,
  showDetails = false
) => {
  // console.log("showBalances");

  // testnet faucet https://faucet.testnet.chrysalis2.com and https://faucet.tanglekit.de/
  // if (showDetails) {
  for (let accountIndex = 0; accountIndex < N_ACCOUNTS; accountIndex++) {
    const addresses = await client
      .getAddresses(seed)
      .accountIndex(accountIndex)
      .range(0, 1)
      .get();
    console.log(`Account #${accountIndex} starts with address ${addresses[0]}`);
  }
  // }

  let nBalancesKnown = 0;
  let balanceChanged = false;

  for (let accountIndex = 0; accountIndex < nAccounts; accountIndex++) {
    client
      .getBalance(seed)
      .accountIndex(accountIndex)
      .initialAddressIndex(0)
      .get()
      .then(async (balance) => {
        nBalancesKnown++;
        if (balance !== balances[accountIndex]) balanceChanged = true;

        balances[accountIndex] = balance;
        if (nBalancesKnown >= nAccounts && balanceChanged) {
          console.log(
            `${balances.reduce((t, v) => t + v)} IOTA in total (${balances.join(
              "+"
            )})`
          );
        }

        if (showDetails) {
          client
            .getAddresses(seed)
            .accountIndex(accountIndex)
            .range(0, 20)
            // .include_internal()
            .get()
            .then((addresses) => {
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
            })
            .catch((err) => console.error(err.message));
        }
      })
      .catch((err) => console.error(err.message));
  }

  setTimeout(
    () => showBalances(client, seed, balances, nAccounts, false),
    BALANCE_REFRESH_INTERVAL
  );
};

module.exports = { showBalances };
