package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import com.homosphere.backend.dto.PropertySearchParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Query("UPDATE PropertyListing pl SET pl.views = pl.views + 1 WHERE pl.propertyListingId = :propertyListingId")
    @Modifying
    void updateViewCount(UUID propertyListingId);

    @Query("SELECT pl.propertyListingId FROM PropertyListing pl JOIN pl.savedByUsers u WHERE u.id = :userId")
    List<UUID> findSavedListingIdsByUserId(@Param("userId") UUID userId);

    List<PropertyListing> findAllBySavedByUsers_Id(UUID userId);

    @Query("""
        SELECT pl FROM PropertyListing pl
        JOIN pl.property p
        JOIN p.location l
        WHERE pl.status = 'PUBLISHED' AND (
            (:#{#searchParams.city} IS NULL OR LOWER(l.city) LIKE LOWER(CONCAT('%', :#{#searchParams.city}, '%'))) AND
            (:#{#searchParams.state} IS NULL OR LOWER(l.state) LIKE LOWER(CONCAT('%', :#{#searchParams.state}, '%'))) AND
            (:#{#searchParams.minPrice} IS NULL OR pl.price >= :#{#searchParams.minPrice}) AND
            (:#{#searchParams.maxPrice} IS NULL OR pl.price <= :#{#searchParams.maxPrice}) AND
            (:#{#searchParams.bedrooms} IS NULL OR p.bedrooms >= :#{#searchParams.bedrooms}) AND
            (:#{#searchParams.bathrooms} IS NULL OR p.bathrooms >= :#{#searchParams.bathrooms}) AND
            (:#{#searchParams.minLotAreaSqFt} IS NULL OR p.lotAreaSqFt >= :#{#searchParams.minLotAreaSqFt}) AND
            (:#{#searchParams.maxLotAreaSqFt} IS NULL OR p.lotAreaSqFt <= :#{#searchParams.maxLotAreaSqFt}) AND
            (:#{#searchParams.type} IS NULL OR p.type = :#{#searchParams.type})
        ) AND (
              :#{#searchParams.searchQuery} IS NULL OR
              LOWER(pl.title) LIKE LOWER(CONCAT('%', :#{#searchParams.searchQuery}, '%')) OR
              LOWER(pl.description) LIKE LOWER(CONCAT('%', :#{#searchParams.searchQuery}, '%')) OR
              LOWER(l.city) LIKE LOWER(CONCAT('%', :#{#searchParams.searchQuery}, '%')) OR
              LOWER(l.state) LIKE LOWER(CONCAT('%', :#{#searchParams.searchQuery}, '%')) OR
              LOWER(p.type) LIKE LOWER(CONCAT('%', :#{#searchParams.searchQuery}, '%'))
        )
    """)
    Page<PropertyListing> SearchPropertiesBySearchParams(PropertySearchParams searchParams, Pageable pageable);
}
