// https://client-lib.docs.iota.org/libraries/nodejs/examples.html#listening-to-mqtt
// https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/luca-moser/protocol-rfcs/rfc/node-event-api/text/0033-node-event-api/0033-node-event-api.yml

const mqtt = async (
  argv,
  client,
  addressWithAllowance,
  skipDuplicatePayloads = false
) => {
  const topics = [
    `milestones/confirmed`,
    // `milestones/latest`,
    // `addresses/${addressWithAllowance}/outputs`,
    // `messages/indexation/${argv.messageIndex}`, // Buffer.from(argv.messageIndex).toString("hex")
  ];
  argv.verbose && console.log("MQTT subscribes to topics", topics);

  const lastTopicPayload = {};

  client
    .subscriber()
    .topics(topics)
    .subscribe((err, data) => {
      if (err) return console.error("mqtt error:", err.message);

      if (
        skipDuplicatePayloads &&
        lastTopicPayload[data.payload] === data.payload
      )
        return;

      lastTopicPayload[data.payload] = data.payload;
      console.log("MQTT", JSON.stringify(data));
    });
};

module.exports = { mqtt };
