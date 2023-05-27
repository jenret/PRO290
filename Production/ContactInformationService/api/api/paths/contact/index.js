const ContactInformationService = require("../../dal/services/ContactInformationService");
const contact = new  ContactInformationService();

module.exports = function () {
    let operations = {
        GET,
        POST
    };

    async function GET(req, res, next) {
        try {
            const ContactInformation = await contact.getAllContactInformation();
            res.status(200).json({
                contacts: ContactInformation
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
            const newContactInformation = await contact.createContactInformation(req.body);
            res.status(201).json({
                contacts: newContactInformation
            });
        } catch (err) {
            console.error(err);
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

    POST.apiDoc = {
        summary: "Add a new contactinformation to the database",
        operationId: "add-contact-information",
        requestBody: {
            description: "The contactinformation to add",
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


    return operations;
};