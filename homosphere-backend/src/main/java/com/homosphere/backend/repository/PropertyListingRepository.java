package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.model.property.PropertyListing;


@Repository
public interface PropertyListingRepository extends JpaRepository<PropertyListing, UUID> {
    List<PropertyListing> findBySeller_Id(UUID sellerId);

    @Query("SELECT COUNT(pl) FROM PropertyListing pl WHERE pl.seller.id = :userId")
    Long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(pl.views), 0) FROM PropertyListing pl WHERE pl.seller.id = :userId")
    Integer sumViewsByUserId(@Param("userId") UUID userId);

    @Query("SELECT pl FROM PropertyListing pl WHERE pl.status = 'PUBLISHED'")
    List<PropertyListing> findAllPublishedListings();

    @Query("SELECT pl FROM PropertyListing pl WHERE pl.status = :status AND pl.seller.id = :sellerId")
    List<PropertyListing> findAllBySellerAndStatus(@Param("sellerId") UUID sellerId, @Param("status") PropertyListingStatus status);

    @Query("SELECT pl FROM PropertyListing pl WHERE pl.status = :status")
    List<PropertyListing> findByStatus(@Param("status") PropertyListingStatus status);

    @Query("SELECT DISTINCT pl.status FROM PropertyListing pl WHERE pl.seller.id = :userId")
    List<PropertyListingStatus> findDistinctStatusesByUserId(@Param("userId") UUID userId);
}
