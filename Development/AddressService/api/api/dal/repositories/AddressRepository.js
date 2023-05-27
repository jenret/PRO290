// AddressRepository.js
const sql = require('mssql');
const {
    faker
} = require('@faker-js/faker');
const Address = require("../models/Address");

class AddressRepository {
    constructor() {
        this.config = {
            user: 'sa',
            password: 'abc123!!@',
            server: 'localhost',
            database: 'order_management_system',
            options: {
                encrypt: true, // Enable if using Azure SQL
                trustServerCertificate: true, // Enable if using Azure SQL
            },
        };
    }

    // Methods that interact with the address table
    async getAddressById(addressId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM addresses WHERE id = '${addressId}'`);
            const addressData = result.recordset[0];

            if (!addressData) {
                throw new Error('Address not found');
            }

            // Construct and return a Address object
            return new Address(
                addressData.id,
                addressData.street_address,
                addressData.street_address_two,
                addressData.city,
                addressData.state,
                addressData.zipcode,
                addressData.country
            );
        } catch (error) {
            throw new Error(`Failed to fetch address: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllAddresss() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM addresses`;
            const addresssData = result.recordset;

            if (!addresssData) {
                throw new Error('No addresss found');
            }

            // Construct and return a list of Address objects
            return addresssData.map(addressData => new Address(
                addressData.id,
                addressData.street_address,
                addressData.street_address_two,
                addressData.city,
                addressData.state,
                addressData.zipcode,
                addressData.country
            ));
        } catch (error) {
            throw new Error(`Failed to fetch all addresss: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createAddress(address) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO addresses(street_address, street_address_two, city, state, zipcode, country) VALUES ('${address.street_address}', '${address.street_address_two}', '${address.city}', '${address.state}', '${address.zipcode}', '${address.country}')`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateAddress(id, address) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE addresses SET street_address='${address.street_address}', street_address_two='${address.street_address_two}', city='${address.city}', state='${address.state}', zipcode='${address.zipcode}', country='${address.country}' WHERE id='${id}'`, );
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteAddress(addressId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM addresses WHERE id='${addressId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }


    async populateDatabase() {
        // console.log(faker.location.buildingNumber)
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeAddress = {
                    street_address: faker.location.street(),
                    street_address_two: faker.location.secondaryAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipcode: faker.location.zipCode(),
                    country: faker.location.country()
                }
                 await sql.query `INSERT INTO addresses(street_address, street_address_two, city, state, zipcode, country)  VALUES (${fakeAddress.street_address}, ${fakeAddress.street_address_two}, ${fakeAddress.city}, ${fakeAddress.state}, ${fakeAddress.zipcode}, ${fakeAddress.country})`;
            }
        } catch (error) {
            throw new Error(`Failed to create address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = AddressRepository;