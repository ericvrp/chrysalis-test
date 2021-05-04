const { ONE_IOTA, ONE_MIOTA } = require("./constants");
const { sleep } = require("./utils");

const valueSpam = async (client, seed) => {
  const testAccountIndex = 1;
  const testWalletAddress =
    "iota1qrjqsakhe9fw4t0v84s04jglkf65zrt83h8vggmlxhg5fyq8du04k07dgk9"; // test wallet
  const allowanceAmount = ONE_MIOTA;

  const testWalletBalance = await client
    .getBalance(seed)
    .accountIndex(testAccountIndex)
    .initialAddressIndex(0)
    .get();

  if (testWalletBalance === 0) {
    const message = await client
      .message()
      .seed(seed)
      .dustAllowanceOutput(testWalletAddress, allowanceAmount)
      .submit();
    console.log(
      `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${message.messageId} (allowance)`
    );

    while (
      (await client
        .getBalance(seed)
        .accountIndex(testAccountIndex)
        .initialAddressIndex(0)
        .get()) === 0
    )
      console.log("Waiting for allowance to arrive");
    await sleep(1000);
  }

  const amount = ONE_IOTA;
  client
    .message()
    .seed(seed)
    .output(testWalletAddress, amount)
    .submit()
    .then((message) =>
      console.log(
        `https://explorer.iota.org/${process.env.IOTA_NETWORK}/message/${message.messageId} (1i transaction)`
      )
    )
    .catch((err) => console.error(err.message));
};

module.exports = { valueSpam };
