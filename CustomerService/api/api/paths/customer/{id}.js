const CustomerService = require("../../dal/services/CustomerService");
const customerservice = new CustomerService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const CustomerService = await customerservice.getCustomerById(req.params.id);
            res.status(200).json({
                customerservice: CustomerService
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
            const newCustomerService = await customerservice.updateCustomer(req.params.id, req.body);
            res.status(201).json({
                customerservice: newCustomerService
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
            await customerservice.deleteCustomer(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "CustomerService successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }




    GET.apiDoc = {
        summary: "Retrieve all customerservice from the database",
        operationId: "get-customerservice-s",
        responses: {
            200: {
                description: "Returns a list of all CustomerService",
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

    PATCH.apiDoc = {
        summary: "Updates an existing customerservice in the database",
        operationId: "update-customerservice",
        requestBody: {
            description: "The customerservice to update",
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Customer"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added customerservice",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Customer"
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
        summary: "Removes an existing customerservice in the database",
        operationId: "delete-customerservice-",
        requestBody: {
            description: "The customerservice to delete",
            required: false,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Customer"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added customerservice",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Customer"
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