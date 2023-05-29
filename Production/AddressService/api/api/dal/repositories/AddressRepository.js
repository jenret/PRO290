const sql = require('mssql');
const kafka = require("../../service/kafka");
const {
    faker
} = require('@faker-js/faker');
const Address = require("../models/Address");

class AddressRepository {
    constructor() {
        this.config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            database: process.env.DB_NAME,
            options: {
                encrypt: true, // Enable if using Azure SQL
                trustServerCertificate: true, // Enable if using Azure SQL
            },
        };
    }

    async produceKafkaMessage(level, type, response) {
        try {
            kafka.produceMessage(level, {
                type: type,
                response: response
            });
        } catch (error) {
            console.error(`Failed to produce Kafka message: ${error.message}`);
        }
    }

    async getAddressById(addressId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM addresses WHERE id = '${addressId}'`);
            const addressData = result.recordset[0];

            this.produceKafkaMessage("info", "getAddressById", `${addressId} was retrieved from the database`);

            if (!addressData) {
                throw new Error('Address not found');
            }

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
            this.produceKafkaMessage("error", "getAddressById", `Failed to fetch address: ${error.message}`);
            throw new Error(`Failed to fetch address: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllAddresss() {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM addresses`);
            const addressesData = result.recordset;

            this.produceKafkaMessage("info", "getAllAddresses", `All addresses were fetched`);

            if (!addressesData) {
                throw new Error('No addresses found');
            }

            return addressesData.map(addressData => new Address(
                addressData.id,
                addressData.street_address,
                addressData.street_address_two,
                addressData.city,
                addressData.state,
                addressData.zipcode,
                addressData.country
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllAddresses", `Failed to fetch all addresses`);
            throw new Error(`Failed to fetch all addresses: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createAddress(address) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO addresses(street_address, street_address_two, city, state, zipcode, country) VALUES ('${address.street_address}', '${address.street_address_two}', '${address.city}', '${address.state}', '${address.zipcode}', '${address.country}')`);
            this.produceKafkaMessage("info", "createAddress", `An address was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createAddress", `Failed to create an address`);
            throw new Error(`Failed to create address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateAddress(id, address) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE addresses SET street_address='${address.street_address}', street_address_two='${address.street_address_two}', city='${address.city}', state='${address.state}', zipcode='${address.zipcode}', country='${address.country}' WHERE id='${id}'`);
            this.produceKafkaMessage("info", "updateAddress", `${id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateAddress", `Failed to update address`);
            throw new Error(`Failed to update address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteAddress(addressId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM addresses WHERE id='${addressId}'`);
            this.produceKafkaMessage("info", "deleteAddress", `${addressId} was removed from the database`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteAddress", `Failed to delete address`);
            throw new Error(`Failed to delete address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async populateDatabase() {
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
                await sql.query(`INSERT INTO addresses(street_address, street_address_two, city, state, zipcode, country) VALUES ('${fakeAddress.street_address}', '${fakeAddress.street_address_two}', '${fakeAddress.city}', '${fakeAddress.state}', '${fakeAddress.zipcode}', '${fakeAddress.country}')`);
            }

            this.produceKafkaMessage("info", "populateDatabase", "Multiple addresses were created");
        } catch (error) {
            this.produceKafkaMessage("error", "populateDatabase", `Failed to create addresses`);
            throw new Error(`Failed to create address: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = AddressRepository;