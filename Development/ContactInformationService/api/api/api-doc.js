const apiDoc = {
    openapi: "3.0.2",
    info: {
        title: "ContactInformation Service API",
        version: "1.0.0"
    },
    paths: {},
    components: {
        schemas: {
            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string"
                    },
                    internal_code: {
                        type: "string"
                    }
                }
            },
            ContactInformation: {
                type: "object",
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    first_name: {
                        type: 'string',
                    },
                    last_name: {
                        type: 'string',
                    },
                    phone_number: {
                        type: 'string',
                    },
                    email_address: {
                        type: 'string',
                    },
                    is_active: {
                        type: 'string',
                    },
                    date_created: {
                        type: 'string',
                        format: 'date-time',
                    },
                    date_modified: {
                        type: 'string',
                        format: 'date-time',
                    }
                },
            }
        }
    }
};

module.exports = apiDoc;