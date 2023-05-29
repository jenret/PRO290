const sql = require('mssql');
const kafka = require("../../service/kafka");
const {
    faker
} = require('@faker-js/faker');
const Customer = require("../models/Customer");

class CustomerRepository {
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

    async getCustomerById(customerId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM customer WHERE id = '${customerId}'`);
            const customerData = result.recordset[0];

            this.produceKafkaMessage("info", "getCustomerById", `${customerId} was retrieved from the database`);

            if (!customerData) {
                throw new Error('Customer not found');
            }

            return new Customer(
                customerData.id,
                customerData.name,
                customerData.address_id,
                customerData.contact_id
            );
        } catch (error) {
            this.produceKafkaMessage("error", "getCustomerById", `Failed to fetch customer: ${error.message}`);
            throw new Error(`Failed to fetch customer: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllCustomers() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM customer`;
            const customersData = result.recordset;

            this.produceKafkaMessage("info", "getAllCustomers", `All customers were fetched`);

            if (!customersData) {
                throw new Error('No customers found');
            }

            return customersData.map(customerData => new Customer(
                customerData.id,
                customerData.name,
                customerData.address_id,
                customerData.contact_id
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllCustomers", `Failed to fetch all customers`);
            throw new Error(`Failed to fetch all customers: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createCustomer(customer) {
        try {
            await sql.connect(this.config);
            const contactResult = await sql.query(`SELECT * FROM contact_information WHERE id = '${customer.contact_id}'`);
            if (contactResult.recordset.length === 0) {
                throw new Error(`Contact ID ${customer.contact_id} does not exist`);
            }

            const addressResult = await sql.query(`SELECT * FROM addresses WHERE id = '${customer.address_id}'`);
            if (addressResult.recordset.length === 0) {
                throw new Error(`Address ID ${customer.address_id} does not exist`);
            }

            const result = await sql.query(`INSERT INTO customer(name, contact_id, address_id) VALUES ('${customer.name}','${customer.contact_id}', '${customer.address_id}')`);

            this.produceKafkaMessage("info", "createCustomer", `A customer was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createCustomer", `Failed to create customer`);
            throw new Error(`Failed to create customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateCustomer(customer) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE customer SET name='${customer.name}', address_id='${customer.address_id}', contact_id='${customer.contact_id}' WHERE id='${customer.id}'`);

            this.produceKafkaMessage("info", "updateCustomer", `${customer.id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateCustomer", `Failed to update customer`);
            throw new Error(`Failed to update customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteCustomer(customerId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM customer WHERE id='${customerId}'`);

            this.produceKafkaMessage("info", "deleteCustomer", `${customerId} was removed from the database`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteCustomer", `Failed to delete customer`);
            throw new Error(`Failed to delete customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = CustomerRepository;
