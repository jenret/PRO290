package io.github.xanderendre.CustomerService.repositories;

import io.github.xanderendre.CustomerService.model.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface CustomerRepository extends CrudRepository<Customer, UUID> {
    
}
