const { SECOND, MESSAGE_INDEX } = require("./constants");
const { sleep, throttle } = require("./utils");

const dataSpam = async (argv, client) => {
  const startTime = new Date(); // start the clock once getInfo has finished
  let nSpammedMessages = 0;

  for (;;) {
    try {
      const message = await client
        .message()
        .index(MESSAGE_INDEX)
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
      console.error(err.message);
      await throttle();
    }

    await sleep(argv["dataspam-interval"] * SECOND);
  }
};

module.exports = { dataSpam };
