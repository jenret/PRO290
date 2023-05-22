package io.github.xanderendre.CustomerService.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.xanderendre.CustomerService.model.Customer;
import io.github.xanderendre.CustomerService.repositories.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer saveCustomer(Customer customer) {
        // You can add any additional logic here before saving the customer

        // Save the customer using the repository and return the saved object
        return customerRepository.save(customer);
    }

    public List<Customer> findAll() {
        // Return all the customers from the repository
        return (List<Customer>) customerRepository.findAll();
    }

}