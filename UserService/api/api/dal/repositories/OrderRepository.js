// OrderRepository.js
const sql = require('mssql');
const {
    faker
} = require('@faker-js/faker');
const Order = require("../models/Order");

class OrderRepository {
    constructor() {
        this.config = {
            user: 'sa',
            password: 'abc123!!@',
            server: 'localhost',
            database: 'order_management_system',
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
            const result = await sql.query(`SELECT * FROM orders WHERE id = '${orderId}'`);
            const orderData = result.recordset[0];

            if (!orderData) {
                throw new Error('Order not found');
            }

            // Construct and return a Order object
            return new Order(
                orderData.id,
                orderData.street_order,
                orderData.street_order_two,
                orderData.city,
                orderData.state,
                orderData.zipcode,
                orderData.country
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
            const result = await sql.query `SELECT * FROM orders`;
            const ordersData = result.recordset;

            if (!ordersData) {
                throw new Error('No orders found');
            }

            // Construct and return a list of Order objects
            return ordersData.map(orderData => new Order(
                orderData.id,
                orderData.street_order,
                orderData.street_order_two,
                orderData.city,
                orderData.state,
                orderData.zipcode,
                orderData.country
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
            const result = await sql.query(`INSERT INTO orders(street_order, street_order_two, city, state, zipcode, country) VALUES (@street_order, @street_order_two, @city, @state, @zipcode, @country)`, {
                street_order: order.street_order,
                street_order_two: order.street_order_two,
                city: order.city,
                state: order.state,
                zipcode: order.zipcode,
                country: order.country
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
            const result = await sql.query(`UPDATE orders SET street_order='${order.street_order}', street_order_two='${order.street_order_two}', city='${order.city}', state='${order.state}', zipcode='${order.zipcode}', country='${order.country}' WHERE id='${id}'`, );
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
            const result = await sql.query(`DELETE FROM orders WHERE id='${orderId}'`);
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
                    street_order: faker.location.street(),
                    street_order_two: faker.location.secondaryOrder(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipcode: faker.location.zipCode(),
                    country: faker.location.country()
                }
                 await sql.query `INSERT INTO orders(street_order, street_order_two, city, state, zipcode, country)  VALUES (${fakeOrder.street_order}, ${fakeOrder.street_order_two}, ${fakeOrder.city}, ${fakeOrder.state}, ${fakeOrder.zipcode}, ${fakeOrder.country})`;
            }
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = OrderRepository;