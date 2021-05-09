const { ONE_IOTA, ADDRESS_WITH_ALLOWANCE } = require("./constants");
const { sleepSeconds, throttle } = require("./utils");

const valueSpam = async (argv, client, seed, amount = ONE_IOTA) => {
  !argv.quiet && console.log("valueSpam");

  for (;;) {
    try {
      const message = await client
        .message()
        .index(argv.messageIndex)
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

    await sleepSeconds(argv["valuespam-interval"]);
  }
};

module.exports = { valueSpam };
