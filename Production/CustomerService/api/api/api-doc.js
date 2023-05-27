const apiDoc = {
    openapi: "3.0.2",
    info: {
        title: "Customer Service API",
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
            Customer: {
                type: "object",
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    name: {
                        type: 'string',
                    },
                    parent_id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    address_id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    shipping_address_id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    primary_contact_id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    is_active: {
                        type: 'boolean',
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
                //required: ['name', 'parent_id', 'address_id', 'shipping_address_id', 'primary_contact_id', 'is_active']
            }
        }
    }
};

module.exports = apiDoc;