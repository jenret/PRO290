package io.github.xanderendre.CustomerService.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.xanderendre.CustomerService.model.ContactInformation;
import io.github.xanderendre.CustomerService.repositories.ContactInformationRepository;

@Service
public class ContactInformationService {

    private final ContactInformationRepository contactInformationRepository;

    @Autowired
    public ContactInformationService(ContactInformationRepository contactInformationRepository) {
        this.contactInformationRepository = contactInformationRepository;
    }

    public ContactInformation getContactInformationById(UUID id) {
        return contactInformationRepository.findById(id)
                .orElseThrow(() -> null);
    }

    public ContactInformation saveContactInformation(ContactInformation contactInformation) {
        // You can add any additional logic here before saving the customer

        // Save the customer using the repository and return the saved object
        return contactInformationRepository.save(contactInformation);
    }

}