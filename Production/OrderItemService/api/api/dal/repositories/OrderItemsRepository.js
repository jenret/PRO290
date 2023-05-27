// OrderRepository.js
const sql = require('mssql');
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

    // Methods that interact with the order table
    async getOrderById(orderId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM order_items WHERE id = '${orderId}'`);
            const orderData = result.recordset[0];

            if (!orderData) {
                throw new Error('Order not found');
            }

            // Construct and return a Order object
            return new OrderItems(
                orderData.id,
                orderData.order_id,
                orderData.item_id,
                orderData.quantity,
                orderData.price,
                orderData.notes
            );
        } catch (error) {
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

            if (!ordersData) {
                throw new Error('No orders found');
            }

            // Construct and return a list of Order objects
            return ordersData.map(orderData => new OrderItems(
                orderData.id,
                orderData.order_id,
                orderData.item_id,
                orderData.quantity,
                orderData.price,
                orderData.notes
            ));
        } catch (error) {
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
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateOrder(id, order) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE order_items SET order_id='${order.order_id}', item_id='${order.item_id}', quantity='${order.quantity}', price='${order.price}', notes='${order.notes}' WHERE id='${id}'`, );
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteOrder(orderId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM order_items WHERE id='${orderId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }


    async populateDatabase() {
        // console.log(faker.location.buildingNumber)
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
            }
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = OrderItemsRepository;