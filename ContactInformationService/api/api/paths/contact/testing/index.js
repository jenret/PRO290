const ContactInformationService = require("../../../dal/services/ContactInformationService");
const contact = new  ContactInformationService();

module.exports = function () {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        try {
            await contact.populateDatabase();
            res.status(201).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    POST.apiDoc = {
        summary: "Adds several new contactinformation to the database",
        operationId: "add-contact-information",
        requestBody: {
            description: "The contact_information to add",
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