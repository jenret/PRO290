package io.github.xanderendre.CustomerService.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.github.xanderendre.CustomerService.model.Address;
import io.github.xanderendre.CustomerService.repositories.AddressRepository;
import io.github.xanderendre.CustomerService.services.AddressService;

@RestController
@RequestMapping("/address")
public class AddressRestController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AddressService addressService;

    @GetMapping(path = "/")
    public ResponseEntity<List<Address>> findAllAddresses() {
        List<Address> addresses = (List<Address>) addressRepository.findAll();
        return ResponseEntity.ok(addresses);
    }

    @GetMapping(path = "/{addressUUID}")
    public ResponseEntity<Address> getAddressByUUID(@PathVariable UUID addressUUID) {
        Optional<Address> addressOptional = addressRepository.findById(addressUUID);
        if (addressOptional.isPresent()) {
            Address address = addressOptional.get();
            return ResponseEntity.ok(address);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
    }

    @PostMapping(path = "/")
    public ResponseEntity<Address> createAddress(@RequestBody Address addressDTO) {
        System.out.println(addressDTO.toString());
        try {
            System.out.println(addressDTO);
            Address address = new Address();
            address.setStreetAddress(addressDTO.getStreetAddress());
            address.setStreetAddressTwo(addressDTO.getStreetAddressTwo());
            address.setCity(addressDTO.getCity());
            address.setState(addressDTO.getState());
            address.setZipcode(addressDTO.getZipcode());
            address.setCountry(addressDTO.getCountry());

            // data validation!
            address = addressService.saveAddress(address);
            return new ResponseEntity<>(address, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping(path = "/{addressUUID}")
    public ResponseEntity<Address> updateAddressByUUID(@PathVariable UUID addressUUID, @RequestBody Address addressDTO) {
        Optional<Address> addressOptional = addressRepository.findById(addressUUID);
        if (addressOptional.isPresent()) {
            Address address = addressOptional.get();

            address.setId(address.getId());
            address.setStreetAddress(addressDTO.getStreetAddress() != null ? addressDTO.getStreetAddress() : address.getStreetAddress());
            address.setStreetAddressTwo(addressDTO.getStreetAddressTwo() != null ? addressDTO.getStreetAddressTwo() : address.getStreetAddressTwo());
            address.setCity(addressDTO.getCity() != null ? addressDTO.getCity() : address.getCity());
            address.setState(addressDTO.getState() != null ? addressDTO.getState() : address.getState());
            address.setZipcode(addressDTO.getZipcode() != null ? addressDTO.getZipcode() : address.getZipcode());
            address.setCountry(addressDTO.getCountry() != null ? addressDTO.getCountry() : address.getCountry());
            address.setDateCreated(address.getDateCreated());
            address.setDateModified(LocalDateTime.now());
            addressRepository.save(address);

            return ResponseEntity.ok(address);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
    }

    @DeleteMapping(path = "/{addressUUID}")
    public ResponseEntity<Void> deleteAddressByUUID(@PathVariable UUID addressUUID) {
        Optional<Address> addressOptional = addressRepository.findById(addressUUID);
        if (addressOptional.isPresent()) {
            addressRepository.deleteById(addressUUID);
            return ResponseEntity.ok().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
    }

    @PostMapping(path = "/generate/{quantity}")
    public ResponseEntity<List<Address>> generateAddress(@PathVariable int quantity) {

        try {
            Faker faker = new Faker();
            List<Address> addresses = new ArrayList<>();
            Address address = null;

            for (int i = 0; i < quantity; i++) {
                address = new Address();
                address.setStreetAddress(faker.address().streetAddress());
                address.setStreetAddressTwo(faker.address().secondaryAddress());
                address.setCity(faker.address().cityName());
                address.setState(faker.address().state());
                address.setZipcode(faker.address().zipCode());
                address.setCountry(faker.address().country());

                address = addressService.saveAddress(address);

                addresses.add(address);
            }
            return new ResponseEntity<>(addresses, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
