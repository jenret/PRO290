const {
    Kafka
} = require("kafkajs");

const brokerAddress = process.env.BROKER_SERVER_ADDRESS;
const clientID = process.env.CLIENT_ID;

const kafka = new Kafka({
    brokers: [brokerAddress],
    clientId: clientID,
});

const producer = kafka.producer({
    idempotent: true
}); // enable idempotent producer if required

async function connectProducer() {
    try {
        await producer.connect();
        console.log("Producer successfully connected");
    } catch (err) {
        console.error("Could not connect producer, retrying in 5 seconds", err);
        setTimeout(connectProducer, 5000);
    }
}

async function produceMessage(eventName, eventData) {
    try {
        const results = await producer.send({
            topic: "address_topic",
            messages: [{
                key: eventName,
                value: JSON.stringify(eventData),
            }],
        });

        console.log(results);
        return results;
    } catch (err) {
        console.error("Error producing message", err);
        return err;
    }
}

// Connect producer on start
connectProducer();

exports.produceMessage = produceMessage;