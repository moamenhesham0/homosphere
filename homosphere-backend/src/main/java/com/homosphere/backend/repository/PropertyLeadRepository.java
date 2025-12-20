package com.homosphere.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.property.PropertyListing;

@Repository
public interface PropertyLeadRepository extends JpaRepository<PropertyListing, UUID> {
    
    @Query("SELECT COUNT(pl) FROM PropertyListing pl " +
           "JOIN pl.savedByUsers u " +
           "WHERE pl.seller.id = :userId")
    Integer countLeadsByUserId(@Param("userId") UUID userId);
}
