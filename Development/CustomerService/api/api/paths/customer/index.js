const CustomerService = require("../../dal/services/CustomerService");
const customerService = new CustomerService();

module.exports = function () {
    let operations = {
        GET,
        POST
    };

    async function GET(req, res, next) {

        try {
            const customers = await customerService.getAllCustomers();
            res.status(200).json({
                customers: customers
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    async function POST(req, res, next) {

        try {
            const customers = await customerService.createCustomer(req.body);
            res.status(200).json({
                customers: customers
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    GET.apiDoc = {
        summary: "Retrieve no customers from the database because broken",
        description: "Lorem ipsum",
        operationId: "get-customers",
        responses: {
            200: {
                description: "Returns a list of all customers",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Customer",
                        },
                    },
                },
            },
            500: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error",
                        },
                    },
                },
            },
        },
    };

    POST.apiDoc = {
        summary: "Adds a new customer to the database",
        description: "Lorem ipsum",
        operationId: "add-customers",
        responses: {
            201: {
                description: "Successfully added customers",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Customer",
                        },
                    },
                },
            },
            500: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error",
                        },
                    },
                },
            },
        },
    };
    return operations;
};