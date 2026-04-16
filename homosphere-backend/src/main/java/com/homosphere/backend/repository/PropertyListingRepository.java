package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

import com.homosphere.backend.dto.PropertySearchLimits;
import com.homosphere.backend.dto.PropertySearchParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.model.property.PropertyListing;
import org.locationtech.jts.geom.Point;


@Repository
public interface PropertyListingRepository extends JpaRepository<PropertyListing, UUID> {
    List<PropertyListing> findBySeller_Id(UUID sellerId);

    Page<PropertyListing> findBySeller_Id(UUID sellerId, Pageable pageable);

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
    void updateViewCount(UUID propertyListingId);

    @Query("SELECT pl.propertyListingId FROM PropertyListing pl JOIN pl.savedByUsers u WHERE u.id = :userId")
    List<UUID> findSavedListingIdsByUserId(@Param("userId") UUID userId);

    List<PropertyListing> findAllBySavedByUsers_Id(UUID userId);

    Optional<PropertyListing> findByProperty_PropertyId(UUID propertyId);


    @Query("""
        SELECT
        pl FROM PropertyListing pl
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
            (:#{#searchParams.minPropertyAreaSqFt} IS NULL OR p.propertyAreaSqFt >= :#{#searchParams.minPropertyAreaSqFt}) AND
            (:#{#searchParams.maxPropertyAreaSqFt} IS NULL OR p.propertyAreaSqFt <= :#{#searchParams.maxPropertyAreaSqFt}) AND
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
    Page<PropertyListing> searchPropertiesBySearchParams(PropertySearchParams searchParams, Pageable pageable);

    @Query("""
    SELECT pl
    FROM PropertyListing pl
    JOIN pl.property p
    JOIN p.location l
    WHERE l.latitude BETWEEN :minLat AND :maxLat
      AND l.longitude BETWEEN :minLng AND :maxLng
""")
    List<PropertyListing> searchPropertyListingByBBox(
            @Param("minLng") double minLng,
            @Param("minLat") double minLat,
            @Param("maxLng") double maxLng,
            @Param("maxLat") double maxLat
    );

    @Query("""
    SELECT new com.homosphere.backend.dto.PropertySearchLimits (
        MIN(pl.price),
        MAX(pl.price),
        MIN(p.lotAreaSqFt),
        MAX(p.lotAreaSqFt),
        MIN(p.propertyAreaSqFt),
        MAX(p.propertyAreaSqFt),
        MIN(p.bathrooms),
        MAX(p.bathrooms),
        MIN(p.bedrooms),
        MAX(p.bedrooms)
    )
    FROM PropertyListing pl
    JOIN pl.property p
    WHERE pl.status = 'PUBLISHED'
""")
    PropertySearchLimits fetchLimits();
}

