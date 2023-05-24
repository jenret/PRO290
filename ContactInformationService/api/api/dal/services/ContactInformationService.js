const Joi = require('joi'); // import the Joi validation library
const ContactInformationRepository = require('../repositories/ContactInformationRepository');

class ContactInformationService {
    constructor() {
        this.contactinformationRepository = new ContactInformationRepository();
    }

    async getAllContactInformation() {
        return this.contactinformationRepository.getAllContactInformation();
    }

    async getContactInformationById(id) {
        return this.contactinformationRepository.getContactInformationById(id);
    }

    async createContactInformation(contactinformationData) {
        // Define a schema for contactinformation data
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(), // Optional field
            phone_number: Joi.string().required(),
            email_address: Joi.string().required(),
        });

        // Validate the contactinformationData against the schema
        const {
            error
        } = schema.validate(contactinformationData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid contactinformation data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with creating the contactinformation
        return this.contactinformationRepository.createContactInformation(contactinformationData);
    }

    async populateDatabase() {
         return this.contactinformationRepository.populateDatabase();
    }

    async updateContactInformation(id, contactinformationData) {
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(), // Optional field
            phone_number: Joi.string().required(),
            email_address: Joi.string().required()
        });

        // Validate the contactinformationData against the schema
        const {
            error
        } = schema.validate(contactinformationData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid contactinformation data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with updating the contactinformation
        return this.contactinformationRepository.updateContactInformation(id, contactinformationData);
    }

    async deleteContactInformation(id) {
        return this.contactinformationRepository.deleteContactInformation(id);
    }
}

module.exports = ContactInformationService;