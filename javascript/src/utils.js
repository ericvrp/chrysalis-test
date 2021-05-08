const sleep = async (delayInMs) => {
  // if (delayInMs > 0) console.log(`sleep ${delayInMs}ms`);
  return new Promise((r) => setTimeout(r, delayInMs));
};

const sleepSeconds = async (delayInSeconds) => {
  // if (delayInSeconds > 0) console.log(`sleepSeconds ${delayInSeconds}s`);
  return sleep(delayInSeconds * 1000);
};

const throttle = async () => {
  return sleepSeconds(10); // blocktime
};

module.exports = { sleep, sleepSeconds, throttle };
