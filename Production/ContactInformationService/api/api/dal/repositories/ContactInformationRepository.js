const sql = require('mssql');
const kafka = require("../../service/kafka");
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

    async getContactInformationById(contactinformationId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM contact_information WHERE id = '${contactinformationId}'`);
            const contactinformationData = result.recordset[0];

            this.produceKafkaMessage("info", "getContactInformationById", `${contactinformationId} was retrieved from the database`);

            if (!contactinformationData) {
                throw new Error('ContactInformation not found');
            }

            return new ContactInformation(
                contactinformationData.id,
                contactinformationData.first_name,
                contactinformationData.last_name,
                contactinformationData.phone_number,
                contactinformationData.email_address,
            );
        } catch (error) {
            this.produceKafkaMessage("error", "getContactInformationById", `Failed to fetch address: ${error.message}`);
            throw new Error(`Failed to fetch contactinformation: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllContactInformation() {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM contact_information`);
            const ContactInformationData = result.recordset;

            this.produceKafkaMessage("info", "getAllContactInformation", `All contacts were fetched`);

            if (!ContactInformationData) {
                throw new Error('No ContactInformation found');
            }

            return ContactInformationData.map(contactinformationData => new ContactInformation(
                contactinformationData.id,
                contactinformationData.first_name,
                contactinformationData.last_name,
                contactinformationData.phone_number,
                contactinformationData.email_address,
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllContactInformation", `Failed to fetch all addresses`);
            throw new Error(`Failed to fetch all ContactInformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createContactInformation(contactinformation) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO contact_information(first_name, last_name, phone_number, email_address) VALUES ('${contactinformation.first_name}', '${contactinformation.last_name}', '${contactinformation.phone_number}', '${contactinformation.email_address}')`);
            this.produceKafkaMessage("info", "createContactInformation", `A contact was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createContactInformation", `Failed to create an address`);
            throw new Error(`Failed to create contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateContactInformation(id, contactinformation) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE contact_information SET first_name='${contactinformation.first_name}', last_name='${contactinformation.last_name}', phone_number='${contactinformation.phone_number}', email_address='${contactinformation.email_address}' WHERE id='${id}'`);
            this.produceKafkaMessage("info", "updateContactInformation", `The contact ${id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateContactInformation", `Failed to update the address ${id}`);
            throw new Error(`Failed to update contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteContactInformation(contactinformationId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM contact_information WHERE id='${contactinformationId}'`);
            this.produceKafkaMessage("info", "deleteContactInformation", `The contact ${contactinformationId} was deleted`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteContactInformation", `Failed to delete the address ${contactinformationId}`);
            throw new Error(`Failed to delete contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async populateDatabase() {
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeContactInformation = {
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    phone_number: faker.phone.number(),
                    email_address: faker.internet.email(),
                }
                await sql.query(`INSERT INTO contact_information(first_name, last_name, phone_number, email_address)  VALUES ('${fakeContactInformation.first_name}', '${fakeContactInformation.last_name}', '${fakeContactInformation.phone_number}', '${fakeContactInformation.email_address}')`);
            }
        } catch (error) {
            throw new Error(`Failed to create contactinformation: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = ContactInformationRepository;
