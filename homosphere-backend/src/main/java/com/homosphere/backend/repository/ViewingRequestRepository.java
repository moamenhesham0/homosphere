package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.ViewingRequest;

@Repository
public interface ViewingRequestRepository extends JpaRepository<ViewingRequest, UUID> {
    
    @Query("SELECT DISTINCT vr FROM ViewingRequest vr " +
           "LEFT JOIN FETCH vr.processedRequest " +
           "WHERE vr.user.id = :userId")
    List<ViewingRequest> findByUser_Id(@Param("userId") UUID userId);

    List<ViewingRequest> findByProperty_PropertyId(UUID propertyId);
    
    @Query("SELECT vr FROM ViewingRequest vr " +
    "JOIN vr.property p " +
    "JOIN PropertyListing pl ON pl.property.propertyId = p.propertyId " +
    "LEFT JOIN FETCH vr.processedRequest " + 
    "WHERE pl.seller.id = :sellerId " +
    "ORDER BY vr.preferredDate DESC, vr.startTime ASC")
    List<ViewingRequest> findByPropertyListingSellerId(@Param("sellerId") UUID sellerId);
}