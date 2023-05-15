package io.github.xanderendre.CustomerService.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.xanderendre.CustomerService.model.CustomerParent;
import io.github.xanderendre.CustomerService.repositories.CustomerParentRepository;

@Service
public class CustomerParentService {

    private final CustomerParentRepository customerParentRepository;

    @Autowired
    public CustomerParentService(CustomerParentRepository customerParentRepository) {
        this.customerParentRepository = customerParentRepository;
    }

    public CustomerParent getCustomerParentById(UUID id) {
        return customerParentRepository.findById(id)
                .orElseThrow(() -> null);
    }

}