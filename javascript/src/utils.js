const { SECOND } = require("./constants");

const sleep = async (delayInMs = SECOND) => {
  // if (delayInMs > 0) console.log(`sleep ${delayInMs}ms`);
  return new Promise((r) => setTimeout(r, delayInMs));
};

const throttle = async () => {
  return sleep(10 * SECOND);
};

module.exports = { sleep, throttle };
