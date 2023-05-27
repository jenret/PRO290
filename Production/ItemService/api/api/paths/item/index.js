const ItemService = require("../../dal/services/ItemService");
const itemService = new ItemService();

module.exports = function () {
    let operations = {
        GET,
        POST
    };

    async function GET(req, res, next) {
        try {
            const items = await itemService.getAllItems();
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

    async function POST(req, res, next) {
        try {
            const newItem = await itemService.createItem(req.body);
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

    POST.apiDoc = {
        summary: "Add a new item to the database",
        operationId: "add-item",
        requestBody: {
            description: "The item to add",
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


    return operations;
};