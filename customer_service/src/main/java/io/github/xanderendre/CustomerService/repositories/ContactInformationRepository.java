package io.github.xanderendre.CustomerService.repositories;

import org.springframework.data.repository.CrudRepository;

import io.github.xanderendre.CustomerService.model.ContactInformation;

import java.util.UUID;

public interface ContactInformationRepository extends CrudRepository<ContactInformation, UUID> {
    
}
