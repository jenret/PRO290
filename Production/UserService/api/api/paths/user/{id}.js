const UserService = require("../../dal/services/UserService");
const userService = new UserService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const users = await userService.getUserById(req.params.id);
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

    async function PATCH(req, res, next) {
        try {
            const newUser = await userService.updateUser(req.params.id, req.body);
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

    async function DELETE(req, res, next) {
        try {
            await userService.deleteUser(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "User successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
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

    PATCH.apiDoc = {
        summary: "Updates an existing user in the database",
        operationId: "update-user",
        requestBody: {
            description: "The user to update",
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

    DELETE.apiDoc = {
        summary: "Removes an existing user in the database",
        operationId: "delete-user",
        requestBody: {
            description: "The user to delete",
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