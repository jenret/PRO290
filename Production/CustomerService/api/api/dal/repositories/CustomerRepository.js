// CustomerRepository.js
const sql = require('mssql');
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

    // Methods that interact with the customer table
    async getCustomerById(customerId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM customer WHERE id = '${customerId}'`);
            const customerData = result.recordset[0];

            if (!customerData) {
                throw new Error('Customer not found');
            }

            // Construct and return a Customer object
            return new Customer(
                customerData.id,
                customerData.name,
                customerData.address_id,
                customerData.contact_id
            );
        } catch (error) {
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

            if (!customersData) {
                throw new Error('No customers found');
            }

            // Construct and return a list of Customer objects
            return customersData.map(customerData => new Customer(
                customerData.id,
                customerData.name,
                customerData.address_id,
                customerData.contact_id
            ));
        } catch (error) {
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
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateCustomer(customer) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE customer SET name='${customer.name}', address_id='${customer.address_id}', contact_id='${customer.contact_id}' WHERE id='${customer.id}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteCustomer(customerId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM customer WHERE id='${customerId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete customer: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = CustomerRepository;


// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const KafkaProducer = require('../../../services/kafka_client'); 

// class CustomerRepository {
//     constructor() {
//         this.PROTO_PATH = __dirname + '/customer.proto';


//         const packageDefinition = protoLoader.loadSync(
//             this.PROTO_PATH, {
//                 keepCase: true,
//                 longs: String,
//                 enums: String,
//                 defaults: true,
//                 oneofs: true,
//             });

//         const customer_proto = grpc.loadPackageDefinition(packageDefinition).customer;

//         this.client = new customer_proto.CustomerService.service(
//             'localhost:50051', // replace with your gRPC server address
//             grpc.credentials.createInsecure()
//         );
//     }

//     async findById(customerId) {
//         return new Promise((resolve, reject) => {
//             this.client.GetCustomer({
//                 id: customerId
//             }, function (err, response) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(response);
//                 }
//             });
//         });
//     }

//     async getAllCustomers() {
//         return new Promise((resolve, reject) => {
//             this.client.GetAllCustomers({}, function (err, response) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(response.customers);
//                 }
//             });
//         });
//     }

//     async create(customer) {
//         KafkaProducer.produceMessage("CustomerTopic", "CreateCustomer", customer);
//     }

//     async update(customer) {
//         KafkaProducer.produceMessage("CustomerTopic", "UpdateCustomer", customer);
//     }

//     async delete(customerId) {
//         KafkaProducer.produceMessage("CustomerTopic", "DeleteCustomer", {
//             id: customerId
//         });
//     }
// }

// module.exports = CustomerRepository;