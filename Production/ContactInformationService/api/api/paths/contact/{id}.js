const ContactInformationService = require("../../dal/services/ContactInformationService");
const contact = new  ContactInformationService();

module.exports = function () {
    let operations = {
        GET,
        PATCH,
        DELETE
    };

    async function GET(req, res, next) {
        try {
            const ContactInformation = await contact.getContactInformationById(req.params.id);
            res.status(200).json({
                contact: ContactInformation
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
            const newContactInformation = await contact.updateContactInformation(req.params.id, req.body);
            res.status(201).json({
                contact: newContactInformation
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
            await contact.deleteContactInformation(req.params.id); // Assuming 'id' is the URL parameter
            res.status(200).json({
                message: "ContactInformation successfully deleted"
            });
        } catch (err) {
            console.error(err.message); // Log the error message directly
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }




    GET.apiDoc = {
        summary: "Retrieve all contactinformation from the database",
        operationId: "get-contact-informations",
        responses: {
            200: {
                description: "Returns a list of all ContactInformation",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ContactInformation",
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
        summary: "Updates an existing contactinformation in the database",
        operationId: "update-contact-information",
        requestBody: {
            description: "The contactinformation to update",
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ContactInformation"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added contactinformation",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ContactInformation"
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
        summary: "Removes an existing contactinformation in the database",
        operationId: "delete-contact-information",
        requestBody: {
            description: "The contactinformation to delete",
            required: false,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ContactInformation"
                    }
                }
            }
        },
        responses: {
            201: {
                description: "Successfully added contactinformation",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ContactInformation"
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