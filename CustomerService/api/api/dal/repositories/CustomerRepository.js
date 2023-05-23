// CustomerRepository.js
const sql = require('mssql');
const Customer = require("../models/Customer");

class CustomerRepository {
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

    // Methods that interact with the customer table
    async findById(customerId) {
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
                customerData.contact_id,
                customerData.shipping_address_id,
                customerData.primary_contact_id,
                customerData.is_active
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
                customerData.contact_id,
                customerData.shipping_address_id,
                customerData.primary_contact_id,
                customerData.is_active
            ));
        } catch (error) {
            throw new Error(`Failed to fetch all customers: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async create(customer) {

    }

    async update(customer) {

    }

    async delete(customerId) {

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

