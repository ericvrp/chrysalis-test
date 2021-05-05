const { SECOND } = require("./constants");

const sleep = async (delayInMs = SECOND) => {
  return new Promise((r) => setTimeout(r, delayInMs));
};

module.exports = { sleep };
