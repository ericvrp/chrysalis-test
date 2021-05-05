const { ONE_IOTA, VALUESPAM_REFRESH_INTERVAL } = require("./constants");
const { sleep } = require("./utils");

const valueSpam = async (client, seed, amount = ONE_IOTA) => {
  for (;;) {
    client
      .message()
      .index(process.env.IOTA_MESSAGE_INDEX)
      .data(`valueSpam ${amount}i @${new Date().toISOString()}`)
      .seed(seed)
      .output(process.env.IOTA_ADDRESS_WITH_ALLOWANCE, amount)
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
