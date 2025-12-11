package com.homosphere.backend.repository;

import com.homosphere.backend.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import com.homosphere.backend.model.PropertyListing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID> {

   @Query(value = """
    SELECT pl.* FROM property_listing pl
    JOIN property p ON pl.property_id = p.property_id 
    LEFT JOIN location l ON p.location_id = l.location_id
    WHERE (
        to_tsvector('english', 
              COALESCE(l.city, '') || ' ' ||
              COALESCE(l.state, '') || ' ' ||
              COALESCE(l.street, '') || ' ' ||
              COALESCE(p.type::text, '') || ' ' ||
              COALESCE(p.condition::text, '') || ' ' ||
              COALESCE(p.bedrooms::text, '') || ' ' ||
              COALESCE(p.bathrooms::text, '') || ' ' ||
              COALESCE(pl.title, '') || ' ' ||
              COALESCE(pl.description, '')
          ) @@ websearch_to_tsquery('english', :userInput)
        OR LOWER(l.city) LIKE LOWER(CONCAT('%', :userInput, '%'))
        OR LOWER(l.state) LIKE LOWER(CONCAT('%', :userInput, '%'))
        OR LOWER(pl.title) LIKE LOWER(CONCAT('%', :userInput, '%'))
    )
    ORDER BY 
        CASE 
            WHEN LOWER(l.city) = LOWER(:userInput) THEN 1
            WHEN LOWER(l.city) LIKE LOWER(CONCAT(:userInput, '%')) THEN 2
            ELSE 3
        END,
        ts_rank(
            to_tsvector('english', 
                COALESCE(l.city, '') || ' ' ||
                COALESCE(l.state, '') || ' ' ||
                COALESCE(l.street, '') || ' ' ||
                COALESCE(p.type::text, '') || ' ' ||
                COALESCE(p.condition::text, '') || ' ' ||
                COALESCE(p.bedrooms::text, '') || ' ' ||
                COALESCE(p.bathrooms::text, '') || ' ' ||
                COALESCE(pl.title, '') || ' ' ||
                COALESCE(pl.description, '')
            ), 
            websearch_to_tsquery('english', :userInput)
        ) DESC
    """, nativeQuery = true)
    
    Page<PropertyListing> searchPropertyListings(@Param("userInput") String userInput, Pageable pageable);
    
    @Query(value = """
    SELECT pl.* FROM property_listing pl
    JOIN property p ON pl.property_id = p.property_id
    LEFT JOIN location l ON p.location_id = l.location_id
    WHERE (:bedrooms IS NULL OR p.bedrooms = :bedrooms)
      AND (:bathrooms IS NULL OR p.bathrooms = :bathrooms)
      AND (:minPrice IS NULL OR pl.price >= :minPrice)
      AND (:maxPrice IS NULL OR pl.price <= :maxPrice)
      AND (:minYear IS NULL OR p.year_built >= :minYear)
      AND (:maxYear IS NULL OR p.year_built <= :maxYear)
      AND (:city IS NULL OR LOWER(l.city) = LOWER(:city))
      AND (:state IS NULL OR LOWER(l.state) = LOWER(:state))
    """,
    nativeQuery = true)
    Page<PropertyListing> filterPropertyListings(
        @Param("bedrooms") Integer bedrooms,
        @Param("bathrooms") Integer bathrooms,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("minYear") Integer minYear,
        @Param("maxYear") Integer maxYear,
        @Param("city") String city,
        @Param("state") String state,
        Pageable pageable
    );
}
