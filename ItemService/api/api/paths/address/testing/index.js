const ItemService = require("../../../dal/services/ItemService");
const itemService = new ItemService();

module.exports = function () {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        try {
            await itemService.populateDatabase();
            res.status(201).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    POST.apiDoc = {
        summary: "Adds several new item to the database",
        operationId: "add-items",
        requestBody: {
            description: "The items to add",
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