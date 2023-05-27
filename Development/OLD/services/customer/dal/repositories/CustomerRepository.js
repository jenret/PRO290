// CustomerRepository.js
const Customer = require("../models/Customer");

class CustomerRepository {
  constructor() {
      this.config = {
          user: 'sa',
          password: 'abc123!!@',
          server: 'localhost',
          database: 'CustomerServiceDB',
          options: {
              encrypt: true, // Enable if using Azure SQL
              trustServerCertificate: true, // Enable if using Azure SQL
          },
      };
  }
    
    // Methods that interact with the customer table
  async findById(customerId) {
      try {
          await sql.connect(this.config);
          const result = await sql.query(`SELECT * FROM customer WHERE id = '${customerId}'`);
          const customerData = result.recordset[0];

          if (!customerData) {
              throw new Error('Customer not found');
          }

          // Construct and return a Customer object
          return new Customer(
              customerData.id,
              customerData.name,
              customerData.addressId,
              customerData.contactId,
          );
      } catch (error) {
          throw new Error(`Failed to fetch customer: ${error.message}`);
      } finally {
          sql.close();
      }
  }

    async findAll() {

    }

    async create(customer) {

    }

    async update(customer) {

    }

    async delete(customerId) {

    }
}

module.exports = CustomerRepository;