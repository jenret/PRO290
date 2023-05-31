const CustomerService = require('./CustomerService');
const CustomerRepository = require('../repositories/CustomerRepository');
const Joi = require('joi');

// Mock the CustomerRepository
jest.mock('../repositories/CustomerRepository');

describe('CustomerService', () => {
    let customerService;
    let mockCustomerData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        customerService = new CustomerService();

        mockCustomerData = {
            name: "John Doe",
            contact_id: "test-contact",
            address_id: "test-address"
        };

        // Clear all mock calls before each test
        CustomerRepository.mockClear();
    });

    test('getAllCustomers calls repository', async () => {
        await customerService.getAllCustomers();
        expect(CustomerRepository.prototype.getAllCustomers).toHaveBeenCalledTimes(1);
    });

    test('getCustomerById calls repository with correct id', async () => {
        const id = 'test-id';
        await customerService.getCustomerById(id);
        expect(CustomerRepository.prototype.getCustomerById).toHaveBeenCalledWith(id);
    });

    test('createCustomer validates input and calls repository', async () => {
        await customerService.createCustomer(mockCustomerData);
        expect(CustomerRepository.prototype.createCustomer).toHaveBeenCalledWith(mockCustomerData);
    });

    test('createCustomer throws an error if input is invalid', async () => {
        
        const invalidCustomerData = {...mockCustomerData, name: undefined};

        await expect(customerService.createCustomer(invalidCustomerData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateCustomer and deleteCustomer
});