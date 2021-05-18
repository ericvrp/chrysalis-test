const { sleepSeconds, throttle } = require("./utils");

const dataSpam = async (argv, client) => {
  !argv.quiet && console.log("dataSpam");

  const startTime = new Date(); // start the clock once getInfo has finished
  let nSpammedMessages = 0;

  for (;;) {
    try {
      const message = await client
        .message()
        .index(argv.messageIndex)
        .data(`dataSpam @${new Date().toISOString()}`)
        .submit();

      nSpammedMessages++;

      console.log(
        `https://explorer.iota.org/${argv.network}/message/${
          message.messageId
        } (spamming ${(
          (nSpammedMessages / (new Date() - startTime)) *
          1000
        ).toFixed(2)} MPS data)`
      );
    } catch (err) {
      console.error("dataSpam error:", err.message);
      await throttle();
    }

    await sleepSeconds(argv["dataspam-interval"]);
  }
};

module.exports = { dataSpam };
