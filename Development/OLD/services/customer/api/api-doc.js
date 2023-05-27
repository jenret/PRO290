const apiDoc = {
    openapi: "3.0.0",
    info: {
        title: "Customer Service API",
        version: "1.0.0"
    },
    // servers: [{
    //     url: "http://localhost:5000"
    // }],
    paths: {},
    // paths: {
    //     "/customer/{id}": {
    //         get: {
    //             tags: ['Customer'],
    //             description: "Get a customer by ID",
    //             operationId: "get-customer",
    //             parameters: [{
    //                 name: "id",
    //                 in: "path",
    //                 description: "ID of the customer to retrieve",
    //                 required: true,
    //                 schema: {
    //                     type: "string",
    //                     format: "uuid"
    //                 }
    //             }],
    //             responses: {
    //                 '200': {
    //                     description: 'Customer information',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Customer'
    //                             }
    //                         }
    //                     }
    //                 },
    //                 '404': {
    //                     description: 'Customer not found',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Error'
    //                             },
    //                             example: {
    //                                 message: 'Customer not found',
    //                                 internal_code: 'customer_not_found'
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //     },
    //     "/customer": {
    //         get: {
    //             tags: ['Customer'],
    //             description: "Retrieves a list of all customers",
    //             operationId: "get-customers",
    //             responses: {
    //                 '200': {
    //                     description: 'Customers information',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Customer'
    //                             }
    //                         }
    //                     }
    //                 },
    //                 '404': {
    //                     description: 'Customers not found',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Error'
    //                             },
    //                             example: {
    //                                 message: 'Customer not found',
    //                                 internal_code: 'customer_not_found'
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         post: {
    //             tags: ['Customer'],
    //             description: "Create a new customer",
    //             operationId: "create-customer",
    //             requestBody: {
    //                 description: "Information for the new customer",
    //                 required: true,
    //                 content: {
    //                     'application/json': {
    //                         schema: {
    //                             $ref: '#/components/schemas/Customer'
    //                         }
    //                     }
    //                 }
    //             },
    //             responses: {
    //                 '201': {
    //                     description: 'Customer created',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Customer'
    //                             }
    //                         }
    //                     }
    //                 },
    //                 '400': {
    //                     description: 'Bad request',
    //                     content: {
    //                         'application/json': {
    //                             schema: {
    //                                 $ref: '#/components/schemas/Error'
    //                             },
    //                             example: {
    //                                 message: 'Invalid data',
    //                                 internal_code: 'invalid_data'
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //     }
    // },
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