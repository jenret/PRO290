const OrderService = require("../../dal/services/OrderService");
const orderService = new OrderService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const orders = await orderService.getOrderById(req.params.id);
            res.status(200).json({
                orders: orders
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    async function PATCH(req, res, next) {
        try {
            const newOrder = await orderService.updateOrder(req.params.id, req.body);
            res.status(201).json({
                order: newOrder
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    async function DELETE(req, res, next) {
        try {
            await orderService.deleteOrder(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "Order successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }




    GET.apiDoc = {
        summary: "Retrieve all orderes from the database",
        operationId: "get-orders",
        responses: {
            200: {
                description: "Returns a list of all orders",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Order",
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

    PATCH.apiDoc = {
        summary: "Updates an existing order in the database",
        operationId: "update-order",
        requestBody: {
            description: "The order to update",
            required: true,
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

    DELETE.apiDoc = {
        summary: "Removes an existing order in the database",
        operationId: "delete-order",
        requestBody: {
            description: "The order to delete",
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