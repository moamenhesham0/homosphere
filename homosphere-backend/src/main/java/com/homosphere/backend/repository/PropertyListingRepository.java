package com.homosphere.backend.repository;

import com.homosphere.backend.model.PropertyListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
import java.util.UUID;

public interface PropertyListingRepository extends JpaRepository<PropertyListing, UUID> {
}
