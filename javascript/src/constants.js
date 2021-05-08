const MS = 1;
const SECOND = 1000 * MS;
const MINUTE = 60 * SECOND;

module.exports = {
  MS,
  SECOND,
  MINUTE,

  ONE_IOTA: 1,
  ONE_KIOTA: 1000,
  ONE_MIOTA: 1000000,
  ONE_GIOTA: 1000000000,

  NODE: {
    mainnet: "https://chrysalis-nodes.iota.org",
    testnet: "https://api.lb-0.testnet.chrysalis2.com",
  },

  ADDRESS_WITH_ALLOWANCE: {
    mainnet: "iota1qrjqsakhe9fw4t0v84s04jglkf65zrt83h8vggmlxhg5fyq8du04k07dgk9",
    testnet: "atoi1qrzwd6svxmsv5sp04qyaw3fjpdwve4ccylgm5s6f3pe0rf9wdtzggrquwxz",
  },

  N_ACCOUNTS: 2,
  ACCOUNTINDEX_WITH_ALLOWANCE: 1,
  MESSAGE_INDEX: "chrysalis-test",
};
