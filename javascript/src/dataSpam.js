const { GETINFO_REFRESH_INTERVAL, MESSAGE_INDEX } = require("./constants");

const dataSpam = async (argv, client) => {
  let lastMessagesPerSecond = 0;

  const getInfo = async () => {
    // console.log("getInfo");

    try {
      const info = await client.getInfo();
      // console.log(info);

      if (
        lastMessagesPerSecond != Math.round(info.nodeinfo.messagesPerSecond)
      ) {
        lastMessagesPerSecond = Math.round(info.nodeinfo.messagesPerSecond);
        console.log(
          `https://explorer.iota.org/${argv.network}/indexed/${MESSAGE_INDEX} (${lastMessagesPerSecond} MPS)`
        );
      }
    } catch (err) {
      console.error(err.message);
    }

    setTimeout(getInfo, GETINFO_REFRESH_INTERVAL);
  };
  await getInfo();

  // console.log("dataSpam");
  const startTime = new Date(); // start the clock once getInfo has finished
  let nSpammedMessages = 0;

  for (;;) {
    try {
      const message = await client
        .message()
        .index(MESSAGE_INDEX)
        .data(
          `dataSpam @${new Date().toISOString()} while ${lastMessagesPerSecond} MPS`
        )
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
    }
  }
};

module.exports = { dataSpam };
