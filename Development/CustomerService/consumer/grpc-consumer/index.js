const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const sql = require('mssql');

const PROTO_PATH = __dirname + '/customer.proto';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const customer_proto = grpc.loadPackageDefinition(packageDefinition).customer;

const server = new grpc.Server();

const config = {
    // Database configuration goes here
};

server.addService(customer_proto.CustomerService.service, {
    GetCustomer: async (call, callback) => {
        const customerId = call.request.id;
        try {
            await sql.connect(config);
            const result = await sql.query(`SELECT * FROM customer WHERE id = '${customerId}'`);
            const customerData = result.recordset[0];

            if (!customerData) {
                callback(new Error('Customer not found'));
                return;
            }

            callback(null, {
                id: customerData.id,
                name: customerData.name,
                address_id: customerData.address_id,
                contact_id: customerData.contact_id,
                shipping_address_id: customerData.shipping_address_id,
                primary_contact_id: customerData.primary_contact_id,
                is_active: customerData.is_active
            });
        } catch (error) {
            callback(error);
        } finally {
            sql.close();
        }
    },
    GetAllCustomers: async (_, callback) => {
        try {
            await sql.connect(config);
            const result = await sql.query `SELECT * FROM customer`;
            const customersData = result.recordset;

            if (!customersData) {
                callback(new Error('No customers found'));
                return;
            }

            const customers = customersData.map(customerData => ({
                id: customerData.id,
                name: customerData.name,
                address_id: customerData.address_id,
                contact_id: customerData.contact_id,
                shipping_address_id: customerData.shipping_address_id,
                primary_contact_id: customerData.primary_contact_id,
                is_active: customerData.is_active
            }));

            callback(null, {
                customers
            });
        } catch (error) {
            callback(error);
        } finally {
            sql.close();
        }
    }
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:50051');
    server.start();
});
