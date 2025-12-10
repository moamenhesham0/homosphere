package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.ViewingRequest;

@Repository
public interface ViewingRequestRepository extends JpaRepository<ViewingRequest, UUID> {
    List<ViewingRequest> findByUser_Id(UUID userId);
    List<ViewingRequest> findByPropertyId(UUID propertyId);
}
