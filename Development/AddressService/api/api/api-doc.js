const apiDoc = {
    openapi: "3.0.2",
    info: {
        title: "Address Service API",
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
            Address: {
                type: "object",
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    street_address: {
                        type: 'string',
                    },
                    street_address_two: {
                        type: 'string',
                    },
                    city: {
                        type: 'string',
                    },
                    state: {
                        type: 'string',
                    },
                    zipcode: {
                        type: 'string',
                    },
                    country: {
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
                //required: ['name', 'parent_id', 'address_id', 'shipping_address_id', 'primary_contact_id', 'is_active']
            }
        }
    }
};

module.exports = apiDoc;