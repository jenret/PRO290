const OrderService = require("../../../dal/services/OrderService");
const orderService = new OrderService();

module.exports = function () {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        try {
            await orderService.populateDatabase();
            res.status(201).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    POST.apiDoc = {
        summary: "Adds several new order to the database",
        operationId: "add-orderes",
        requestBody: {
            description: "The orderes to add",
            required: false,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Order"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added order",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Order"
                        }
                    }
                }
            },
            500: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error"
                        }
                    }
                }
            }
        }
    };


    return operations;
};