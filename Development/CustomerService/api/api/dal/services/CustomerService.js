const Joi = require('joi'); // import the Joi validation library
const axios = require('axios')
const CustomerRepository = require('../repositories/CustomerRepository');

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    async getAllCustomers() {
        return this.customerRepository.getAllCustomers();
    }

    async getCustomerById(id) {
        return this.customerRepository.getCustomerById(id);
    }

    async validateUUID(id, serviceName, path, port) {
        const url = `http://${serviceName}:${port}/${path}/${id}`;
        console.warn(url)
        try {
            const response = await axios.get(url);
            return response.status === 200;
        } catch (error) {
            console.error(`Error validating ${serviceName} UUID: ${error.message}`);
            return false;
        }
    }

    async createCustomer(customerData) {
        // Define a schema for contactinformation data
        const schema = Joi.object({
            name: Joi.string().required(),
            contact_id: Joi.string().required(), // Optional field
            address_id: Joi.string().required()
        });

        const isAddressValid = await this.validateUUID(customerData.address_id, 'localhost', 'address', '5001');
        console.log(isAddressValid)
        const isContactInformationValid = await this.validateUUID(customerData.contact_id, 'localhost', 'contact', '5002');
        console.log(isContactInformationValid)

        if (!isAddressValid || !isContactInformationValid) {
            throw new Error('Invalid address or contact information ID');
        }
        // Validate the contactinformationData against the schema
        const {
            error
        } = schema.validate(customerData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid contactinformation data: ${error.details[0].message}`);
        }
        return this.customerRepository.createCustomer(customerData);
    }

    async updateCustomer(id, customerData) {
        // Perform any necessary data validation or business logic operations
        // before calling the repository to update the customer
        return this.customerRepository.updateCustomer(id, customerData);
    }

    async deleteCustomer(id) {
        return this.customerRepository.deleteCustomer(id);
    }
}

module.exports = CustomerService;