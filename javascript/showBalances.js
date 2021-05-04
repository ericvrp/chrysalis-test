const showBalances = async (client, seed, nAccounts = 2) => {
  for (let accountIndex = 0; accountIndex < nAccounts; accountIndex++) {
    client
      .getBalance(seed)
      .accountIndex(accountIndex)
      .initialAddressIndex(0)
      .get()
      .then(async (balance) => {
        if (!balance) return;
        console.log(`Balance of account #${accountIndex} is ${balance} IOTA`);
      })
      .catch((err) => console.error(err.message));

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
            if (!addressBalance?.balance) return;
            console.log(
              `Address #${addressIndex} of account #${accountIndex} has balance ${
                addressBalance.balance
              } (${
                addressBalance.dust_allowed ? "dust allowed" : "no dust allowed"
              })`
            );
          });
        }
      })
      .catch((err) => console.error(err.message));
  }
};

module.exports = { showBalances };
