const { sleepSeconds, throttle } = require("./utils");

const getInfo = async (argv, client) => {
  for (;;) {
    try {
      const info = await client.getInfo();
      // console.log(info);

      console.log(
        `https://explorer.iota.org/${argv.network}/indexed/${argv.messageIndex} (${info.nodeinfo.messagesPerSecond} MPS)`
      );
    } catch (err) {
      console.error(err.message);
      await throttle();
    }

    await sleepSeconds(argv["getinfo-interval"]);
  }
};

module.exports = { getInfo };
