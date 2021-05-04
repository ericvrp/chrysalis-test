const {
  ONE_IOTA,
  ADDRESS_WITH_ALLOWANCE,
  VALUESPAM_REFRESH_INTERVAL,
} = require("./constants");
const { sleep } = require("./utils");

const valueSpam = async (client, seed, amount = ONE_IOTA) => {
  for (;;) {
    client
      .message()
      .seed(seed)
      .output(ADDRESS_WITH_ALLOWANCE, amount)
      .submit()
      .then(async (message) => {
        console.log(
          `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${message.messageId} (${amount}i transaction)`
        );
      })
      .catch((err) => console.error(err.message));

    await sleep(VALUESPAM_REFRESH_INTERVAL);
  }
};

module.exports = { valueSpam };
