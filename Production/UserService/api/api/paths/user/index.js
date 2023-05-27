const UserService = require("../../dal/services/UserService");
const userService = new UserService();

module.exports = function () {
    let operations = {
        GET,
        POST
    };

    async function GET(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({
                users: users
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    async function POST(req, res, next) {
        console.log("I WAS HIT")
        try {
            const newUser = await userService.createUser(req.body);
            res.status(201).json({
                user: newUser
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }


    GET.apiDoc = {
        summary: "Retrieve all users from the database",
        operationId: "get-users",
        responses: {
            200: {
                description: "Returns a list of all users",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/User",
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
        summary: "Add a new user to the database",
        operationId: "add-user",
        requestBody: {
            description: "The user to add",
            required: true,
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