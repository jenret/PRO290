const UserService = require('./UserService');
const UserRepository = require('../repositories/UserRepository');
const Joi = require('joi');

// Mock the UserRepository
jest.mock('../repositories/UserRepository');

describe('UserService', () => {
    let userService;
    let mockUserData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        userService = new UserService();

        mockUserData = {
            first_name: "John",
            last_name: "Doe",
            email_address: "myTest@example.com",
            phone_number: "(801) 123-4567",
            password: "myPassword123"
        };

        // Clear all mock calls before each test
        UserRepository.mockClear();
    });

    test('getAllUsers calls repository', async () => {
        await userService.getAllUsers();
        expect(UserRepository.prototype.getAllUsers).toHaveBeenCalledTimes(1);
    });

    test('getUserById calls repository with correct id', async () => {
        const id = 'test-id';
        await userService.getUserById(id);
        expect(UserRepository.prototype.getUserById).toHaveBeenCalledWith(id);
    });

    test('createUser validates input and calls repository', async () => {
        await userService.createUser(mockUserData);
        expect(UserRepository.prototype.createUser).toHaveBeenCalledWith(mockUserData);
    });

    test('createUser throws an error if input is invalid', async () => {
        
        const invalidUserData = {...mockUserData, first_name: undefined};

        await expect(userService.createUser(invalidUserData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateUser and deleteUser
});