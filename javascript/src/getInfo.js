const { SECOND, MESSAGE_INDEX } = require("./constants");

const getInfo = async (argv, client) => {
  // console.log("getInfo");

  try {
    const info = await client.getInfo();
    // console.log(info);

    console.log(
      `https://explorer.iota.org/${argv.network}/indexed/${MESSAGE_INDEX} (${info.nodeinfo.messagesPerSecond} MPS)`
    );
  } catch (err) {
    console.error(err.message);
  }

  setTimeout(getInfo, argv["getinfo-interval"] * SECOND);
};

module.exports = { getInfo };
