const { SECOND, MESSAGE_INDEX } = require("./constants");
const { sleep, throttle } = require("./utils");

const getInfo = async (argv, client) => {
  for (;;) {
    try {
      const info = await client.getInfo();
      // console.log(info);

      console.log(
        `https://explorer.iota.org/${argv.network}/indexed/${MESSAGE_INDEX} (${info.nodeinfo.messagesPerSecond} MPS)`
      );
    } catch (err) {
      console.error(err.message);
      await throttle();
    }

    await sleep(argv["getinfo-interval"] * SECOND);
  }
};

module.exports = { getInfo };
