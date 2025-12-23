package com.homosphere.backend.repository;

import com.homosphere.backend.model.property.PropertySubmissionReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PropertySubmissionReviewRepository extends JpaRepository<PropertySubmissionReview, UUID> {

}
