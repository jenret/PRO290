const Joi = require('joi'); // import the Joi validation library
const OrderItemsRepository = require('../repositories/OrderItemsRepository');

class OrderItemsService {
    constructor() {
        this.orderItemsRepository = new OrderItemsRepository();
    }

    async getAllOrders() {
        return this.orderRepository.getAllOrders();
    }

    async getOrderById(id) {
        return this.orderItemsRepository.getOrderById(id);
    }

    async createOrder(orderData) {
        // Define a schema for order data
        const schema = Joi.object({
            order_id: Joi.string().required(),
            item_id: Joi.string().required(), // Make it an Optional field -> item_id: Joi.string().allow(''), 
            quantity: Joi.int().required(),
            price: Joi.double().required(),
            notes: Joi.string().required()
        });

        // Validate the orderData against the schema
        const {
            error
        } = schema.validate(orderData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid order data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with creating the order
        return this.orderItemsRepository.createOrder(orderData);
    }

    async populateDatabase() {
         return this.orderItemsRepository.populateDatabase();
    }

    async updateOrder(id, orderData) {
        const schema = Joi.object({
            order_id: Joi.string().required(),
            item_id: Joi.string().required(),
            quantity: Joi.int().required(),
            price: Joi.double().required(), 
            notes: Joi.string().allow(''), // Optional field
           
        });

        // Validate the orderData against the schema
        const {
            error
        } = schema.validate(orderData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid order data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with updating the order
        return this.orderItemsRepository.updateOrder(id, orderData);
    }

    async deleteOrder(id) {
        return this.orderRepository.deleteOrder(id);
    }
}

module.exports = OrderItemsService;