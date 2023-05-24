const Joi = require('joi'); // import the Joi validation library
const OrderRepository = require('../repositories/OrderRepository');

class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async getAllOrders() {
        return this.orderRepository.getAllOrders();
    }

    async getOrderById(id) {
        return this.orderRepository.getOrderById(id);
    }

    async createOrder(orderData) {
        // Define a schema for order data
        const schema = Joi.object({
            customer_id: Joi.string().required(),
            order_date: Joi.string().allow(''), // Optional field
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
            country: Joi.string().required()
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
        return this.orderRepository.createOrder(orderData);
    }

    async populateDatabase() {
         return this.orderRepository.populateDatabase();
    }

    async updateOrder(id, orderData) {
        const schema = Joi.object({
            street_order: Joi.string().required(),
            street_order_two: Joi.string().allow(''), // Optional field
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
            country: Joi.string().required()
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
        return this.orderRepository.updateOrder(id, orderData);
    }

    async deleteOrder(id) {
        return this.orderRepository.deleteOrder(id);
    }
}

module.exports = OrderService;