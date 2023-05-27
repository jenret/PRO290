const UserService = require("../../../dal/services/UserService");
const userService = new UserService();

module.exports = function () {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        try {
            await userService.populateDatabase();
            res.status(201).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    POST.apiDoc = {
        summary: "Adds several new user to the database",
        operationId: "add-useres",
        requestBody: {
            description: "The useres to add",
            required: false,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/User"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added user",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/User"
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