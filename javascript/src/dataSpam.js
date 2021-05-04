const { GETINFO_REFRESH_INTERVAL } = require("./constants");

const dataSpam = async (client, spamMessageIndex = "BC030") => {
  let lastMessagesPerSecond = 0;

  const startTime = new Date();
  let nSpammedMessages = 0;

  const getInfo = async () => {
    // console.log("getInfo");
    client.getInfo().then((info) => {
      // console.log(info);
      if (
        lastMessagesPerSecond != Math.round(info.nodeinfo.messagesPerSecond)
      ) {
        lastMessagesPerSecond = Math.round(info.nodeinfo.messagesPerSecond);
        console.log(
          `https://explorer.iota.org/${process.env.IOTA_NETWORK}/indexed/${spamMessageIndex} (${lastMessagesPerSecond} MPS)`
        );
      }
      setTimeout(getInfo, GETINFO_REFRESH_INTERVAL);
    });
  };
  getInfo();

  for (;;) {
    const message = await client
      .message()
      .index(spamMessageIndex)
      .data(
        `Groeten aan BC030! (Transactie verstuurd om ${new Date().toISOString()} bij ${lastMessagesPerSecond} MPS)`
      )
      .submit();

    nSpammedMessages++;

    console.log(
      `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${
        message.messageId
      } (spamming ${(
        (nSpammedMessages / (new Date() - startTime)) *
        1000
      ).toFixed(2)} MPS data)`
    );
  }
};

module.exports = { dataSpam };
