package com.homosphere.backend.service;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.mapper.PropertySubmissionReviewMapper;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertySubmissionReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertySubmissionReviewService {

    private final PropertySubmissionReviewRepository propertySubmissionReviewRepository;
    private final PropertySubmissionReviewMapper propertySubmissionReviewMapper;
    private final PropertyListingRepository propertyListingRepository;


    @Transactional
    public PropertySubmissionReviewResponse createPropertySubmissionReview(PropertySubmissionReviewRequest request) {
        PropertySubmissionReview propertySubmissionReview;
        UUID propertyListingId = request.getPropertyListingId();

        if (propertySubmissionReviewRepository.existsById(propertyListingId)) {
            return updatePropertySubmissionReview(request);
        }

        try {
            propertySubmissionReview = propertySubmissionReviewMapper.toEntity(request, propertyListingRepository);
        } catch (Exception e) {
            throw new RuntimeException("Error mapping PropertySubmissionReviewRequest to PropertySubmissionReview entity", e);
        }
        propertySubmissionReview.updatePropertyListing();
        PropertySubmissionReview savedReview = propertySubmissionReviewRepository.save(propertySubmissionReview);
        return propertySubmissionReviewMapper.toResponse(savedReview);
    }


    @Transactional
    public PropertySubmissionReviewResponse updatePropertySubmissionReview(PropertySubmissionReviewRequest request) {
        UUID propertyListingId = request.getPropertyListingId();
        if (! propertySubmissionReviewRepository.existsById(propertyListingId)) {
            throw new RuntimeException("PropertySubmissionReview with ID " + propertyListingId + " does not exist.");
        }
        PropertySubmissionReview propertySubmissionReview = propertySubmissionReviewRepository.findById(propertyListingId)
                .orElseThrow(() -> new RuntimeException("PropertySubmissionReview with ID " + propertyListingId + " not found."));

        propertySubmissionReview.setMessage(request.getMessage());
        propertySubmissionReviewRepository.save(propertySubmissionReview);
        return propertySubmissionReviewMapper.toResponse(propertySubmissionReview);
    }

    @Transactional
    public void deletePropertySubmissionReview(UUID propertyListingId) {
        if (! propertySubmissionReviewRepository.existsById(propertyListingId)) {
            throw new RuntimeException("PropertySubmissionReview with ID " + propertyListingId + " does not exist.");
        }
        propertySubmissionReviewRepository.deleteById(propertyListingId);
    }

    public PropertySubmissionReviewResponse getPropertySubmissionReview(UUID propertyListingId) {
        PropertySubmissionReview propertySubmissionReview = propertySubmissionReviewRepository.findById(propertyListingId)
                .orElseThrow(() -> new RuntimeException("PropertySubmissionReview with ID " + propertyListingId + " not found."));
        return propertySubmissionReviewMapper.toResponse(propertySubmissionReview);
    }

    public List<PropertySubmissionReviewResponse> getAllPropertySubmissionReviews() {
        List<PropertySubmissionReview> reviews = propertySubmissionReviewRepository.findAll();
        return reviews.stream()
                .map(propertySubmissionReviewMapper::toResponse)
                .toList();
    }
}
