const { sleepSeconds, throttle } = require("./utils");

const getInfo = async (argv, client) => {
  !argv.quiet && console.log("getInfo");

  for (;;) {
    try {
      const info = await client.getInfo();
      !argv.quiet && console.log(info);

      console.log(
        `https://explorer.iota.org/${argv.network}/indexed/${argv.messageIndex} (${info.nodeinfo.messagesPerSecond} MPS)`
      );
    } catch (err) {
      console.error("getInfo error:", err.message);
      await throttle();
    }

    await sleepSeconds(argv["getinfo-interval"]);
  }
};

module.exports = { getInfo };
