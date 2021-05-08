const {
  ONE_IOTA,
  VALUESPAM_REFRESH_INTERVAL,
  MESSAGE_INDEX,
  ADDRESS_WITH_ALLOWANCE,
} = require("./constants");
const { sleep } = require("./utils");

const valueSpam = async (argv, client, seed, amount = ONE_IOTA) => {
  for (;;) {
    client
      .message()
      .index(MESSAGE_INDEX)
      .data(`valueSpam ${amount}i @${new Date().toISOString()}`)
      .seed(seed)
      .output(ADDRESS_WITH_ALLOWANCE[argv.network], amount)
      .submit()
      .then(async (message) => {
        console.log(
          `https://explorer.iota.org/${argv.network}/message/${message.messageId} (${amount}i transaction)`
        );
      })
      .catch((err) => console.error(err.message));

    await sleep(VALUESPAM_REFRESH_INTERVAL);
  }
};

module.exports = { valueSpam };
