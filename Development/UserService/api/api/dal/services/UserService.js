const Joi = require('joi'); // import the Joi validation library
const UserRepository = require('../repositories/UserRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserById(id) {
        return this.userRepository.getUserById(id);
    }

    async createUser(userData) {
        // Define a schema for user data
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(), // Optional field
            email_address: Joi.string().required(),
            phone_number: Joi.string().required(),
            password: Joi.string().required()
        });

        // Validate the userData against the schema
        const {
            error
        } = schema.validate(userData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid user data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with creating the user
        return this.userRepository.createUser(userData);
    }

    async populateDatabase() {
        return this.userRepository.populateDatabase();
    }

    async updateUser(id, userData) {
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(), // Optional field
            email_address: Joi.string().required(),
            phone_number: Joi.string().required(),
            password: Joi.string().required()
        });

        // Validate the userData against the schema
        const {
            error
        } = schema.validate(userData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid user data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with updating the user
        return this.userRepository.updateUser(id, userData);
    }

    async deleteUser(id) {
        return this.userRepository.deleteUser(id);
    }
}

module.exports = UserService;