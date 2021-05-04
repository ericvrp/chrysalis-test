const sleep = async (ms = 1000) => {
  return new Promise((r) => setTimeout(r, ms));
};

module.exports = { sleep };
