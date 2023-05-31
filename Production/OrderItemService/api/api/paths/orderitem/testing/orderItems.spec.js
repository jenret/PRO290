const OrderItemsService = require('./OrderItemsService');
const OrderItemsRepository = require('../repositories/OrderItemsRepository');
const Joi = require('joi');

// Mock the OrderItemsRepository
jest.mock('../repositories/OrderItemsRepository');

describe('OrderItemsService', () => {
    let orderitemsService;
    let mockOrderItemsData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        orderitemsService = new OrderItemsService();

        mockOrderItemsData = {
            order_id: "test-order-id",
            item_id: "test-item-id",
            quantity: 20,
            price: 23.19,
            notes: "A test order item for the api test"
        };

        // Clear all mock calls before each test
        OrderItemsRepository.mockClear();
    });

    test('getAllOrders calls repository', async () => {
        await orderitemsService.getAllOrders();
        expect(OrderItemsRepository.prototype.getAllOrders).toHaveBeenCalledTimes(1);
    });

    test('getOrderId calls repository with correct id', async () => {
        const id = 'test-id';
        await orderitemsService.getOrderById(id);
        expect(OrderItemsRepository.prototype.getOrderById).toHaveBeenCalledWith(id);
    });

    test('createOrder validates input and calls repository', async () => {
        await orderitemsService.createOrder(mockOrderItemsData);
        expect(OrderItemsRepository.prototype.createOrderItems).toHaveBeenCalledWith(mockOrderItemsData);
    });

    test('createOrderItems throws an error if input is invalid', async () => {
        
        const invalidOrderItemsData = {...mockOrderItemsData, order_id: undefined};

        await expect(orderitemsService.createOrder(invalidOrderItemsData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateOrderItems and deleteOrderItems
});