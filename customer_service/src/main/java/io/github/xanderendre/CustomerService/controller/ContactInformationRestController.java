/**
 * @author Xander
 * @createdOn 5/16/2023 at 5:37 PM
 * @projectName customer_service
 * @packageName io.github.xanderendre.CustomerService.controller;
 */
package io.github.xanderendre.CustomerService.controller;

import io.github.xanderendre.CustomerService.model.Address;
import io.github.xanderendre.CustomerService.model.ContactInformation;
import io.github.xanderendre.CustomerService.repositories.ContactInformationRepository;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/contact")
public class ContactInformationRestController {

    @Autowired
    private ContactInformationRepository contactRepository;

    @GetMapping(path = "/")
    public ResponseEntity<List<ContactInformation>> findAllContactInformation() {
        List<ContactInformation> contacts = (List<ContactInformation>) contactRepository.findAll();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping(path = "/{contactUUID}")
    public ResponseEntity<ContactInformation> getContactByUUID(@PathVariable UUID contactUUID) {
        Optional<ContactInformation> contactOptional = contactRepository.findById(contactUUID);
        if (contactOptional.isPresent()) {
            ContactInformation contactInformation = contactOptional.get();
            return ResponseEntity.ok(contactInformation);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
    }

    @PostMapping(path = "/")
    public ResponseEntity<ContactInformation> createContact(@RequestBody ContactInformation contactDTO) {
        try {
            ContactInformation contact = new ContactInformation();
            contact.setFirstName(contactDTO.getFirstName());
            contact.setLastName(contactDTO.getLastName());
            contact.setEmailAddress(contactDTO.getEmailAddress());
            contact.setPhoneNumber(contactDTO.getPhoneNumber());

            return new ResponseEntity<>(contactRepository.save(contact), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/generate/{quantity}")
    public ResponseEntity<List<ContactInformation>> generateContactInformation(@PathVariable int quantity) {

        try {
            Faker faker = new Faker();
            List<ContactInformation> contacts = new ArrayList<>();
            ContactInformation contact = null;

            for (int i = 0; i < quantity; i++) {
                contact = new ContactInformation();
                contact.setFirstName(faker.name().firstName());
                contact.setLastName(faker.name().lastName());
                contact.setEmailAddress(faker.internet().emailAddress());
                contact.setPhoneNumber(faker.phoneNumber().phoneNumber());

                contact = contactRepository.save(contact);

                contacts.add(contact);
            }
            return new ResponseEntity<>(contacts, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping(path = "/{contactUUID}")
    public ResponseEntity<Void> deleteContactsByUUID(@PathVariable UUID contactUUID) {
        Optional<ContactInformation> contactOptional = contactRepository.findById(contactUUID);
        if (contactOptional.isPresent()) {
            contactRepository.deleteById(contactUUID);
            return ResponseEntity.ok().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
    }

    @PatchMapping(path = "/{addressUUID}")
    public ResponseEntity<ContactInformation> updateContactByUUID(@PathVariable UUID contactUUID, @RequestBody ContactInformation contactDTO) {
        Optional<ContactInformation> contactOptional = contactRepository.findById(contactUUID);
        if (contactOptional.isPresent()) {
            ContactInformation contact = contactOptional.get();

            contact.setId(contact.getId());
            contact.setFirstName(contactDTO.getFirstName() != null ? contactDTO.getFirstName() : contact.getFirstName());
            contact.setLastName(contactDTO.getLastName() != null ? contactDTO.getLastName() : contact.getLastName());
            contact.setEmailAddress(contactDTO.getEmailAddress() != null ? contactDTO.getEmailAddress() : contact.getEmailAddress());
            contact.setPhoneNumber(contactDTO.getPhoneNumber() != null ? contactDTO.getPhoneNumber() : contact.getPhoneNumber());
            contact.setDateCreated(contact.getDateCreated());
            contact.setDateModified(LocalDateTime.now());
            contactRepository.save(contact);

            return ResponseEntity.ok(contact);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
    }


}
