package io.github.xanderendre.CustomerService.repositories;

import io.github.xanderendre.CustomerService.model.CustomerParent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface CustomerParentRepository extends JpaRepository<CustomerParent, UUID> {
    
}
