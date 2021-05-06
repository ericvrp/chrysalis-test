// https://client-lib.docs.iota.org/libraries/nodejs/examples.html#listening-to-mqtt
// https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/luca-moser/protocol-rfcs/rfc/node-event-api/text/0033-node-event-api/0033-node-event-api.yml

const mqtt = async (client) => {
  const topics = [
    // `milestones/confirmed`,
    `milestones/latest`,
    // `addresses/${process.env.IOTA_ADDRESS_WITH_ALLOWANCE}/outputs`,
    // `messages/indexation/${Buffer.from(process.env.IOTA_MESSAGE_INDEX).toString(
    //   "hex"
    // )}`,
  ];
  console.log("MQTT subscribes to topics", topics);
  client
    .subscriber()
    .topics(topics)
    .subscribe((err, data) => {
      console.log("MQTT", JSON.stringify(data));
    });
};

module.exports = { mqtt };
