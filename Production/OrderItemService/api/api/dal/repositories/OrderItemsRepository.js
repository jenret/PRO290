const sql = require('mssql');
const kafka = require("../../../service/kafka");
const {
    faker
} = require('@faker-js/faker');
const OrderItems = require("../models/OrderItems");

class OrderItemsRepository {
    constructor() {
        this.config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            database: process.env.DB_NAME,
            options: {
                encrypt: true, // Enable if using Azure SQL
                trustServerCertificate: true, // Enable if using Azure SQL
            },
        };
    }

    async produceKafkaMessage(level, type, response) {
        try {
            kafka.produceMessage(level, {
                type: type,
                response: response
            });
        } catch (error) {
            console.error(`Failed to produce Kafka message: ${error.message}`);
        }
    }

    async getOrderById(orderId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM order_items WHERE id = '${orderId}'`);
            const orderData = result.recordset[0];

            this.produceKafkaMessage("info", "getOrderById", `Order ${orderId} was retrieved from the database`);

            if (!orderData) {
                throw new Error('Order not found');
            }

            return new OrderItems(
                orderData.id,
                orderData.order_id,
                orderData.item_id,
                orderData.quantity,
                orderData.price,
                orderData.notes
            );
        } catch (error) {
            this.produceKafkaMessage("error", "getOrderById", `Failed to fetch order: ${error.message}`);
            throw new Error(`Failed to fetch order: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllOrders() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM order_items`;
            const ordersData = result.recordset;

            this.produceKafkaMessage("info", "getAllOrders", `All orders were fetched`);

            if (!ordersData) {
                throw new Error('No orders found');
            }

            return ordersData.map(orderData => new OrderItems(
                orderData.id,
                orderData.order_id,
                orderData.item_id,
                orderData.quantity,
                orderData.price,
                orderData.notes
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllOrders", `Failed to fetch all orders: ${error.message}`);
            throw new Error(`Failed to fetch all orders: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createOrder(order) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO orders_items(order_id, item_id, quantity, price, notes) VALUES (@order_id, @item_id, @quantity, @price, @notes)`, {
                order_id: order.order_id,
                item_id: order.item_id,
                quantity: order.quantity,
                price: order.price,
                notes: order.notes
            });

            this.produceKafkaMessage("info", "createOrder", `An order was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createOrder", `Failed to create order: ${error.message}`);
            throw new Error(`Failed to create order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateOrder(id, order) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE order_items SET order_id='${order.order_id}', item_id='${order.item_id}', quantity='${order.quantity}', price='${order.price}', notes='${order.notes}' WHERE id='${id}'`, );

            this.produceKafkaMessage("info", "updateOrder", `Order ${id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateOrder", `Failed to update order: ${error.message}`);
            throw new Error(`Failed to update order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteOrder(orderId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM order_items WHERE id='${orderId}'`);

            this.produceKafkaMessage("info", "deleteOrder", `Order ${orderId} was removed`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteOrder", `Failed to delete order: ${error.message}`);
            throw new Error(`Failed to delete order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async populateDatabase() {
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeOrder = {
                    order_id: faker.location.order_id(),
                    item_id: faker.location.item_id(),
                    quantity: faker.location.quantity(),
                    price: faker.location.price(),
                    notes: faker.location.notes()
                }
                await sql.query `INSERT INTO orders_items(order_id, item_id, quantity, price, notes)  VALUES (${fakeOrder.order_id}, ${fakeOrder.item_id}, ${fakeOrder.quantity}, ${fakeOrder.price}, ${fakeOrder.notes})`;

                this.produceKafkaMessage("info", "populateDatabase", `Order items database populated with fake order: ${fakeOrder}`);
            }
        } catch (error) {
            this.produceKafkaMessage("error", "populateDatabase", `Failed to populate order items database: ${error.message}`);
            throw new Error(`Failed to create order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = OrderItemsRepository;
