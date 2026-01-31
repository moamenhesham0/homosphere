package com.homosphere.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homosphere.backend.model.ProcessedViewingRequest;

@Repository
public interface ProcessedViewingRequestRepository extends JpaRepository<ProcessedViewingRequest, Long> {
}
