const {
    logEvent
} = require('./db');

// Defining a class named baseConsumer
class baseConsumer {
    // The constructor takes a kafka object as a parameter
    constructor(kafka) {
        // It initializes the consumer object with a Kafka consumer. 'order_management' is the consumer group id.
        this.consumer = kafka.consumer({
            groupId: 'order_management'
        });
    }

    // The 'start' method is used to start the Kafka consumer
    async start() {
        try {
            // Connects the consumer to the Kafka broker
            await this.consumer.connect();
            // Subscribes the consumer to 'address-topic'
            await this.consumer.subscribe({
                topic: "address_topic"
            });

            await this.consumer.subscribe({
                topic: "contact_topic"
            });

            await this.consumer.subscribe({
                topic: "customer_topic"
            });

            await this.consumer.subscribe({
                topic: "item_topic"
            });

            await this.consumer.subscribe({
                topic: "order_item_topic"
            });

            await this.consumer.subscribe({
                topic: "order_topic"
            });

            await this.consumer.subscribe({
                topic: "user_topic"
            });


            await this.consumer.run({
                eachMessage: async ({
                    topic,
                    partition,
                    message
                }) => {

                    const key = message.key.toString();
                    const value = message.value.toString();
                    const data = JSON.parse(value);

                    switch (topic) {
                        case 'address_topic':
                            logEvent('address', key, data);
                            break;
                        case 'contact_topic':
                            logEvent('contact', key, data);
                            break;
                        case 'customer_topic':
                            logEvent('customer', key, data);
                            break;
                        case 'item_topic':
                            logEvent('item', key, data);
                            break;
                        case 'order_item_topic':
                            logEvent('order_item', key, data);
                            break;
                        case 'order_topic':
                            logEvent('order', key, data);
                            break;
                        case 'user_topic':
                            logEvent('user', key, data);
                            break;
                    }
                }
            });



        } catch (error) {
            console.error(error);
        }

    }

    // The 'stop' method is used to disconnect the Kafka consumer
    async stop() {
        // Disconnects the consumer from the Kafka broker
        await this.consumer.disconnect();
    }
}

// Exports the baseConsumer class so it can be imported by other modules
module.exports = baseConsumer;