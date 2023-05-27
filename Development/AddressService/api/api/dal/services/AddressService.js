const Joi = require('joi'); // import the Joi validation library
const AddressRepository = require('../repositories/AddressRepository');

class AddressService {
    constructor() {
        this.addressRepository = new AddressRepository();
    }

    async getAllAddresss() {
        return this.addressRepository.getAllAddresss();
    }

    async getAddressById(id) {
        return this.addressRepository.getAddressById(id);
    }

    async createAddress(addressData) {
        // Define a schema for address data
        const schema = Joi.object({
            street_address: Joi.string().required(),
            street_address_two: Joi.string().allow(''), // Optional field
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
            country: Joi.string().required()
        });

        // Validate the addressData against the schema
        const {
            error
        } = schema.validate(addressData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid address data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with creating the address
        return this.addressRepository.createAddress(addressData);
    }

    async populateDatabase() {
         return this.addressRepository.populateDatabase();
    }

    async updateAddress(id, addressData) {
        const schema = Joi.object({
            street_address: Joi.string().required(),
            street_address_two: Joi.string().allow(''), // Optional field
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
            country: Joi.string().required()
        });

        // Validate the addressData against the schema
        const {
            error
        } = schema.validate(addressData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid address data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with updating the address
        return this.addressRepository.updateAddress(id, addressData);
    }

    async deleteAddress(id) {
        return this.addressRepository.deleteAddress(id);
    }
}

module.exports = AddressService;