const {
  SECOND,
  ONE_IOTA,
  MESSAGE_INDEX,
  ADDRESS_WITH_ALLOWANCE,
} = require("./constants");
const { sleep, throttle } = require("./utils");

const valueSpam = async (argv, client, seed, amount = ONE_IOTA) => {
  for (;;) {
    try {
      const message = await client
        .message()
        .index(MESSAGE_INDEX)
        .data(`valueSpam ${amount}i @${new Date().toISOString()}`)
        .seed(seed)
        .output(ADDRESS_WITH_ALLOWANCE[argv.network], amount)
        .submit();

      console.log(
        `https://explorer.iota.org/${argv.network}/message/${message.messageId} (${amount}i transaction)`
      );
    } catch (err) {
      console.error(err.message);
      await throttle();
    }

    await sleep(argv["valuespam-interval"] * SECOND);
  }
};

module.exports = { valueSpam };
