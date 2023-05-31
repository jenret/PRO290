const OrderService = require('./OrderService');
const OrderRepository = require('../repositories/OrderRepository');
const Joi = require('joi');

// Mock the OrderRepository
jest.mock('../repositories/OrderRepository');

describe('OrderService', () => {
    let orderService;
    let mockOrderData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        orderService = new OrderService();

        mockOrderData = {
            customer_id: "test-customer-id",
            order_date: "",
            notes: "A test order for the api tests"
        };

        // Clear all mock calls before each test
        OrderRepository.mockClear();
    });

    test('getAllOrders calls repository', async () => {
        await orderService.getAllOrders();
        expect(OrderRepository.prototype.getAllOrders).toHaveBeenCalledTimes(1);
    });

    test('getOrderById calls repository with correct id', async () => {
        const id = 'test-id';
        await orderService.getOrderById(id);
        expect(OrderRepository.prototype.getOrderById).toHaveBeenCalledWith(id);
    });

    test('createOrder validates input and calls repository', async () => {
        await orderService.createOrder(mockOrderData);
        expect(OrderRepository.prototype.createOrder).toHaveBeenCalledWith(mockOrderData);
    });

    test('createOrder throws an error if input is invalid', async () => {
        
        const invalidOrderData = {...mockOrderData, customer_id: undefined};

        await expect(orderService.createOrder(invalidOrderData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateOrder and deleteOrder
});