const CustomerRepository = require('../dal/repositories/CustomerRepository');

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

    async createCustomer(customerData) {
        // Perform any necessary data validation or business logic operations
        // before calling the repository to create a customer
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
