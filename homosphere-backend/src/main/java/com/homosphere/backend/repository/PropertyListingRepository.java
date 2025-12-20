package com.homosphere.backend.repository;

import com.homosphere.backend.model.property.PropertyListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;



@Repository
public interface PropertyListingRepository extends JpaRepository<PropertyListing, UUID> {
    List<PropertyListing> findBySeller_Id(UUID sellerId);

    @Query("SELECT COUNT(pl) FROM PropertyListing pl WHERE pl.seller.id = :userId")
    Long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(pl.views), 0) FROM PropertyListing pl WHERE pl.seller.id = :userId")
    Integer sumViewsByUserId(@Param("userId") UUID userId);

}
