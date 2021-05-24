const { sleepSeconds, throttle } = require("./utils");

const valueSpam = async (argv, client, seed, addressWithAllowance, amount) => {
  argv.verbose && console.log("valueSpam");

  if (!addressWithAllowance || !amount) {
    return console.error(
      `valueSpam error: incorrect input ${addressWithAllowance} ${amount}`
    );
  }
  // console.log(addressWithAllowance, amount);

  for (;;) {
    try {
      const message = await client
        .message()
        .index(argv.messageIndex)
        .data(`valueSpam ${amount}i @${new Date().toISOString()}`)
        .seed(seed)
        .output(addressWithAllowance, amount)
        .submit();

      console.log(
        `https://explorer.iota.org/${argv.network}/message/${message.messageId} (${amount}i transaction)`
      );
    } catch (err) {
      console.error("valueSpam error:", err.message);
      await throttle();
    }

    await sleepSeconds(argv["valuespam-interval"]);
  }
};

module.exports = { valueSpam };
