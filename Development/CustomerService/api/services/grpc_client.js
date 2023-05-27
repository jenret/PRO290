const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("customer.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const customerPackage = grpcObject.customerPackage;

const client = new customerPackage.Customer("localhost:40000", grpc.credentials.createInsecure());

client.createCustomer({
    /* Customer details here */ }, (err, response) => {
    console.log("Received from server " + JSON.stringify(response));
});

client.readCustomer({
    /* Customer ID here */ }, (err, response) => {
    console.log("Received from server " + JSON.stringify(response));
});
