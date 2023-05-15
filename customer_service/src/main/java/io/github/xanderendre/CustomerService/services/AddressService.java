package io.github.xanderendre.CustomerService.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.xanderendre.CustomerService.model.Address;
import io.github.xanderendre.CustomerService.repositories.AddressRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public Address getAddressById(UUID id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> null);
    }

    public Address saveAddress(Address address) {
        // You can add any additional logic here before saving the customer

        // Save the customer using the repository and return the saved object
        return addressRepository.save(address);
    }

}