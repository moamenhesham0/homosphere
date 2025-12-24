package com.homosphere.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.ProcessedViewingRequest;

@Repository
public interface ProcessedViewingRequestRepository extends JpaRepository<ProcessedViewingRequest, UUID> {
}
