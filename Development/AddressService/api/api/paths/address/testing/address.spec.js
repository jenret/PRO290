const AddressService = require('./AddressService');
const AddressRepository = require('../repositories/AddressRepository');
const Joi = require('joi');

// Mock the AddressRepository
jest.mock('../repositories/AddressRepository');

describe('AddressService', () => {
    let addressService;
    let mockAddressData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        addressService = new AddressService();

        mockAddressData = {
            street_address: '123 Main St',
            city: 'Testville',
            state: 'Test State',
            zipcode: '12345',
            country: 'Test Country'
        };

        // Clear all mock calls before each test
        AddressRepository.mockClear();
    });

    test('getAllAddresss calls repository', async () => {
        await addressService.getAllAddresss();
        expect(AddressRepository.prototype.getAllAddresss).toHaveBeenCalledTimes(1);
    });

    test('getAddressById calls repository with correct id', async () => {
        const id = 'test-id';
        await addressService.getAddressById(id);
        expect(AddressRepository.prototype.getAddressById).toHaveBeenCalledWith(id);
    });

    test('createAddress validates input and calls repository', async () => {
        await addressService.createAddress(mockAddressData);
        expect(AddressRepository.prototype.createAddress).toHaveBeenCalledWith(mockAddressData);
    });

    test('createAddress throws an error if input is invalid', async () => {
        // We've omitted the required 'street_address' field
        const invalidAddressData = {...mockAddressData, street_address: undefined};

        await expect(addressService.createAddress(invalidAddressData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateAddress and deleteAddress
});
