// ContactInformationRepository.js
const sql = require('mssql');
const {
    faker
} = require('@faker-js/faker');
const ContactInformation = require("../models/ContactInformation");

class ContactInformationRepository {
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

    // Methods that interact with the contactinformation table
    async getContactInformationById(contactinformationId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM contact_information WHERE id = '${contactinformationId}'`);
            const contactinformationData = result.recordset[0];

            if (!contactinformationData) {
                throw new Error('ContactInformation not found');
            }

            // Construct and return a ContactInformation object
            return new ContactInformation(
                contactinformationData.id,
                contactinformationData.first_name,
                contactinformationData.last_name,
                contactinformationData.phone_number,
                contactinformationData.email_address,
            );
        } catch (error) {
            throw new Error(`Failed to fetch contactinformation: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllContactInformation() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM contact_information`;
            const ContactInformationData = result.recordset;

            if (!ContactInformationData) {
                throw new Error('No ContactInformation found');
            }

            // Construct and return a list of ContactInformation objects
            return ContactInformationData.map(contactinformationData => new ContactInformation(
                contactinformationData.id,
                    contactinformationData.first_name,
                    contactinformationData.last_name,
                    contactinformationData.phone_number,
                    contactinformationData.email_address,
            ));
        } catch (error) {
            throw new Error(`Failed to fetch all ContactInformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createContactInformation(contactinformation) {
        console.log(contactinformation)
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO contact_information(first_name, last_name, phone_number, email_address, is_active) VALUES ('${contactinformation.first_name}', '${contactinformation.last_name}', '${contactinformation.phone_number}', '${contactinformation.email_address}', 1)`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateContactInformation(id, contactinformation) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE contact_information SET first_name='${contactinformation.first_name}', last_name='${contactinformation.last_name}', phone_number='${contactinformation.phone_number}', email_address='${contactinformation.email_address}' WHERE id='${id}'`, );
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteContactInformation(contactinformationId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM contact_information WHERE id='${contactinformationId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }


    async populateDatabase() {
        // console.log(faker.location.buildingNumber)
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeContactInformation = {
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    phone_number: faker.phone.number(),
                    email_address: faker.internet.email(),
                }
                 await sql.query `INSERT INTO contact_information(first_name, last_name, phone_number, email_address)  VALUES (${fakeContactInformation.first_name}, ${fakeContactInformation.last_name}, ${fakeContactInformation.phone_number}, ${fakeContactInformation.email_address})`;
            }
        } catch (error) {
            throw new Error(`Failed to create contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = ContactInformationRepository;