package io.github.xanderendre.CustomerService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.xanderendre.CustomerService.model.Address;
import io.github.xanderendre.CustomerService.model.ContactInformation;
import io.github.xanderendre.CustomerService.model.Customer;
import io.github.xanderendre.CustomerService.model.CustomerParent;
import io.github.xanderendre.CustomerService.services.AddressService;
import io.github.xanderendre.CustomerService.services.ContactInformationService;
import io.github.xanderendre.CustomerService.services.CustomerParentService;
import io.github.xanderendre.CustomerService.services.CustomerService;

@RestController
@RequestMapping("/customers")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerParentService customerParentService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ContactInformationService contactInformationService;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customerDTO) {
        try {
            CustomerParent customerParent = customerParentService.getCustomerParentById(customerDTO.getCustomerParentId().getId());
            Address address = addressService.getAddressById(customerDTO.getAddressId().getId());
            Address shippingAddress = addressService.getAddressById(customerDTO.getShippingAddressId().getId());
            ContactInformation primaryContact = contactInformationService
                    .getContactInformationById(customerDTO.getPrimaryContactId().getId());

            Customer customer = new Customer();
            customer.setName(customerDTO.getName());
            customer.setCustomerParentId(customerParent);
            customer.setAddressId(address);
            customer.setShippingAddressId(shippingAddress);
            customer.setPrimaryContactId(primaryContact);
            customer.setActive(customerDTO.isActive());

            customer = customerService.saveCustomer(customer);

            return new ResponseEntity<>(customer, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
