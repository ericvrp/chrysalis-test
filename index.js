const { ClientBuilder } = require("@iota/client"); // https://client-lib.docs.iota.org/libraries/nodejs

const client = new ClientBuilder()
  .network("mainnet")
  .node("https://chrysalis-nodes.iota.org")
  .build();

const main = async () => {
  const info = await client.getInfo();
  console.log(new Date().toLocaleString(), info.nodeinfo);

  setTimeout(main, 10 * 1000);
};

main().then().catch(console.error);
