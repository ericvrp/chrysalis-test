// https://client-lib.docs.iota.org/libraries/nodejs/examples.html#listening-to-mqtt
// https://playground.asyncapi.io/?load=https://raw.githubusercontent.com/luca-moser/protocol-rfcs/rfc/node-event-api/text/0033-node-event-api/0033-node-event-api.yml

// `milestones/latest`
// `milestones/confirmed` // XXX multiple identical arrive
// `messages/indexation/${Buffer.from(process.env.IOTA_MESSAGE_INDEX).toString("hex")}` // XXX doesn't work?
// `addresses/${process.env.IOTA_ADDRESS_WITH_ALLOWANCE}/outputs`
const mqqt = async (client) => {
  const topics = [`milestones/latest`];
  console.log("mqqt subscribes to topics", topics);
  client
    .subscriber()
    .topics(topics)
    .subscribe((err, data) => {
      console.log("mqqt", JSON.stringify(data));
    });
};

module.exports = { mqqt };
