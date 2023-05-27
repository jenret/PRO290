const apiDoc = {
    openapi: "3.0.2",
    info: {
        title: "Item Service API",
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
            Item: {
                type: "object",
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    name: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    }
                },
                //required: ['name', 'parent_id', 'item_id', 'shipping_item_id', 'primary_contact_id', 'is_active']
            }
        }
    }
};

module.exports = apiDoc;