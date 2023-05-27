const AddressService = require("../../dal/services/AddressService");
const addressService = new AddressService();

module.exports = function () {
    let operations = {
        GET,
        POST
    };

    async function GET(req, res, next) {
        try {
            res.status(200).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    async function POST(req, res, next) {
        try {
            res.status(201).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }


    GET.apiDoc = {
        summary: "Retrieve all addresses from the database",
        operationId: "get-addresss",
        responses: {
            200: {
                description: "Returns a list of all addresss",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Address",
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
        summary: "Add a new address to the database",
        operationId: "add-address",
        requestBody: {
            description: "The address to add",
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Address"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added address",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Address"
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