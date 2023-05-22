package io.github.xanderendre.CustomerService.controller;

import java.util.List;
import java.util.UUID;

import io.github.xanderendre.CustomerService.model.Address;
import io.github.xanderendre.CustomerService.model.ContactInformation;
import io.github.xanderendre.CustomerService.model.Customer;
import io.github.xanderendre.CustomerService.model.CustomerParent;
import io.github.xanderendre.CustomerService.repositories.AddressRepository;
import io.github.xanderendre.CustomerService.repositories.ContactInformationRepository;
import io.github.xanderendre.CustomerService.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/customers")
public class CustomerRestController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ContactInformationRepository contactInformationRepository;

    @GetMapping(path = "/")
    public ResponseEntity<List<Customer>> findAllCustomers() {
        List<Customer> customers = (List<Customer>) customerRepository.findAll();
        return ResponseEntity.ok(customers);
    }

    @PostMapping(path = "/")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customerDTO) {
            System.out.println("One: " + customerDTO);
        try {
            System.out.println("Two: " + customerDTO.toString());
            ContactInformation customerParent = contactInformationRepository.findById(customerDTO.getCustomerParentId().getId())
                    .orElseThrow(() -> new RuntimeException("Parent Information not found with id: " + customerDTO.getCustomerParentId()));
            Address address = addressRepository.findById(customerDTO.getAddressId().getId())
                    .orElseThrow(() -> new RuntimeException("Address not found with id: " + customerDTO.getCustomerParentId()));
            Address shippingAddress = addressRepository.findById(customerDTO.getShippingAddressId().getId())
                    .orElseThrow(() -> new RuntimeException("Shipping Information not found with id: " + customerDTO.getCustomerParentId()));
            ContactInformation primaryContact = contactInformationRepository.findById(customerDTO.getPrimaryContactId().getId())
                    .orElseThrow(() -> new RuntimeException("Parent Information not found with id: " + customerDTO.getCustomerParentId()));

            Customer customer = new Customer();
            customer.setName(customerDTO.getName());
            customer.setCustomerParentId(customerParent);
            customer.setAddressId(address);
            customer.setShippingAddressId(shippingAddress);
            customer.setPrimaryContactId(primaryContact);
            customer.setActive(customerDTO.isActive());

            customer = customerRepository.save(customer);

//
//            UUID customerParent = contactInformationRepository.findById(customerDTO.getCustomerParentId())
//                    .orElseThrow(() -> new RuntimeException("Parent Information not found with id: " + customerDTO.getCustomerParentId())).getId();
//            System.out.println("CP:" + customerParent);
//            UUID address = addressRepository.findById(customerDTO.getAddressId()).orElseThrow(() -> new RuntimeException("Address not found with id: " + customerDTO.getCustomerParentId())).getId();
//            System.out.println("A:" + address);
//            UUID shippingAddress = addressRepository.findById(customerDTO.getShippingAddressId()).orElseThrow(() -> new RuntimeException("Shipping Information not found with id: " + customerDTO.getCustomerParentId())).getId();
//            System.out.println("SA:" + shippingAddress);
//            UUID primaryContact = contactInformationRepository
//                    .findById(customerDTO.getPrimaryContactId()).orElseThrow(() -> new RuntimeException("Parent Information not found with id: " + customerDTO.getCustomerParentId())).getId();
//            System.out.println("PC:" + primaryContact);
//
//
//            Customer customer = new Customer();
//            customer.setName(customerDTO.getName());
//            customer.setCustomerParentId(customerParent);
//            customer.setAddressId(address);
//            customer.setShippingAddressId(shippingAddress);
//            customer.setPrimaryContactId(primaryContact);
//            customer.setActive(customerDTO.isActive());

            customer = customerRepository.save(customer);

            return new ResponseEntity<>(customer, HttpStatus.CREATED);

        } catch (Exception e) {
            System.out.println(e);
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
