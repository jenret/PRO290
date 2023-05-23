// Initialize Core Imports
const {
    Kafka
} = require("kafkajs");

// Initialize Environmental Variables
const brokerAddress = process.env.BROKER_SERVER_ADDRESS;
const clientID = process.env.CLIENT_ID;

if (!brokerAddress || !clientID) {
    throw new Error('The broker address and client ID must be set.');
}

const kafka = new Kafka({
    brokers: [brokerAddress],
    clientId: clientID,
});

// Create a new producer
const producer = kafka.producer();

// Connect to the producer
producer.connect()
    .then(() => console.log("Connected to Kafka"))
    .catch(err => console.error("Could not connect to Kafka: " + err));

// Define the method that will produce the message
async function produceMessage(topic, eventName, eventData) {
    try {
        // Send the data and return if successful
        const results = await producer.send({
            topic: topic,
            messages: [{
                key: eventName,
                value: JSON.stringify(eventData),
            }, ],
        });

        console.log(results);

        return results;
    } catch (err) {
        console.warn(`There was an error producing the message to topic ${topic}: ${err}`);
        return err;
    }
}

// Disconnect the producer when application is closing down
process.on('SIGTERM', async () => {
    console.info('SIGTERM signal received. Closing Kafka producer.');
    await producer.disconnect();
});

exports.produceMessage = produceMessage;
