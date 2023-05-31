const ContactInformationService = require('./ContactInformationService');
const ContactInformationRepository = require('../repositories/ContactInformationRepository');
const Joi = require('joi');

// Mock the ContactInformationRepository
jest.mock('../repositories/ContactInformationRepository');

describe('ContactInformationService', () => {
    let contactinformationService;
    let mockContactInformationData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        contactinformationService = new ContactInformationService();

        mockContactInformationData = {
            first_name: "John",
            last_name: "Doe",
            phone_number: "(801) 123-4567",
            email_address: "myTest@example.com"
        };

        // Clear all mock calls before each test
        ContactInformationRepository.mockClear();
    });

    test('getAllContactInformations calls repository', async () => {
        await contactinformationService.getAllContactInformations();
        expect(ContactInformationRepository.prototype.getAllContactInformations).toHaveBeenCalledTimes(1);
    });

    test('getContactInformationById calls repository with correct id', async () => {
        const id = 'test-id';
        await contactinformationService.getContactInformationById(id);
        expect(ContactInformationRepository.prototype.getContactInformationById).toHaveBeenCalledWith(id);
    });

    test('createContactInformation validates input and calls repository', async () => {
        await contactinformationService.createContactInformation(mockContactInformationData);
        expect(ContactInformationRepository.prototype.createContactInformation).toHaveBeenCalledWith(mockContactInformationData);
    });

    test('createContactInformation throws an error if input is invalid', async () => {
        
        const invalidContactInformationData = {...mockContactInformationData, first_name: undefined};

        await expect(contactinformationService.createContactInformation(invalidContactInformationData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateContactInformation and deleteContactInformation
});