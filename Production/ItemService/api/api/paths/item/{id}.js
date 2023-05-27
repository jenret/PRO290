const ItemService = require("../../dal/services/ItemService");
const itemService = new ItemService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const items = await itemService.getItemById(req.params.id);
            res.status(200).json({
                items: items
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
            const newItem = await itemService.updateItem(req.params.id, req.body);
            res.status(201).json({
                item: newItem
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
            await itemService.deleteItem(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "Item successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }




    GET.apiDoc = {
        summary: "Retrieve all items from the database",
        operationId: "get-items",
        responses: {
            200: {
                description: "Returns a list of all items",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Item",
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
        summary: "Updates an existing item in the database",
        operationId: "update-item",
        requestBody: {
            description: "The item to update",
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Item"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added item",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Item"
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
        summary: "Removes an existing item in the database",
        operationId: "delete-item",
        requestBody: {
            description: "The item to delete",
            required: false,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Item"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added item",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Item"
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