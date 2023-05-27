const AddressService = require("../../../dal/services/AddressService");
const addressService = new AddressService();

module.exports = function () {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        try {
            await addressService.populateDatabase();
            res.status(201).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    POST.apiDoc = {
        summary: "Adds several new address to the database",
        operationId: "add-addresses",
        requestBody: {
            description: "The addresses to add",
            required: false,
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