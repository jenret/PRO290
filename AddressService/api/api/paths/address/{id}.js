const AddressService = require("../../dal/services/AddressService");
const addressService = new AddressService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const addresss = await addressService.getAllAddresss();
            res.status(200).json({
                addresss: addresss
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
            const newAddress = await addressService.updateAddress(req.params.id, req.body);
            res.status(201).json({
                address: newAddress
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
            await addressService.deleteAddress(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "Address successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
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

    PATCH.apiDoc = {
        summary: "Updates an existing address in the database",
        operationId: "update-address",
        requestBody: {
            description: "The address to update",
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

    DELETE.apiDoc = {
        summary: "Removes an existing address in the database",
        operationId: "delete-address",
        requestBody: {
            description: "The address to delete",
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