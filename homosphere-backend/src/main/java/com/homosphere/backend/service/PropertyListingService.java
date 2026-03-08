package com.homosphere.backend.service;

import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.dto.PropertySearchParams;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertySubmissionReviewRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.updater.PropertyListingUpdater;
import com.stripe.param.ProductSearchParams;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PropertyListingService {

    private final PropertyListingRepository propertyListingRepository;

    private final PropertyListingMapper propertyListingMapper;

    private final PropertyListingUpdater propertyListingUpdater;

    private final PropertySubmissionReviewRepository propertySubmissionReviewRepository;

    private final PropertySubmissionReviewService propertySubmissionReviewService;

    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(PropertyListingService.class);

    @Transactional
    protected PropertyListing createPropertyListing(PropertyListingRequest request) {
        PropertyListing propertyListing;
        try {
            propertyListing = propertyListingUpdater.createWithRelationLinks(request);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        return propertyListingRepository.save(propertyListing);
    }

    @Transactional
    public PropertyListingResponse submitPropertyListing(PropertyListingRequest request) {
        PropertyListing propertyListing = createPropertyListing(request);
        propertyListing.setStatusPending();
        return propertyListingMapper.toResponse(propertyListingRepository.save(propertyListing));
    }

    @Transactional
    public PropertyListingResponse saveDraftPropertyListing(PropertyListingRequest request) {
        PropertyListing propertyListing = createPropertyListing(request);
        return propertyListingMapper.toResponse(propertyListingRepository.save(propertyListing));
    }

    @Transactional
    public PropertyListingResponse resubmitPropertyListing(PropertyListingDraftRequest draftRequest) {
        final UUID propertyListingId = draftRequest.getPropertyListingId();
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + propertyListingId));

        try {
            propertyListingUpdater.applyDraft(propertyListing, draftRequest);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        propertyListing.setStatusPending();
        return propertyListingMapper.toResponse(propertyListing);
    }

    @Transactional
    public PropertyListingResponse editPropertyListing(PropertyListingEditRequest editRequest) {
        final UUID propertyListingId = editRequest.getPropertyListingId();
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + propertyListingId));

        try {
            propertyListingUpdater.applyEdit(propertyListing, editRequest);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        return propertyListingMapper.toResponse(propertyListing);
    }

    public PropertyListingResponse getPropertyListingById(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        return propertyListingMapper.toResponse(propertyListing);
    }

    public PropertyListingPublicResponse getPropertyListingPublicById(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        propertyListingRepository.updateViewCount(id);
        return propertyListingMapper.toPublicResponse(propertyListing);
    }

    public PropertyListingPublicResponse getPublicPropertyListingById(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        propertyListingRepository.updateViewCount(id);
        return propertyListingMapper.toPublicResponse(propertyListing);
    }

    public List<CompactPropertyListingResponse> getAllPropertyListings() {
        List<PropertyListing> listings = propertyListingRepository.findAll();
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllPublishedPropertyListings() {
        List<PropertyListing> listings = propertyListingRepository.findAllPublishedListings();
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllPropertyListingsBySellerAndStatus(UUID sellerId, PropertyListingStatus status) {
        List<PropertyListing> listings = propertyListingRepository.findAllBySellerAndStatus(sellerId, status);
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllPropertyListingsByStatus(PropertyListingStatus status) {
        List<PropertyListing> listings = propertyListingRepository.findByStatus(status);
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyListingStatus> getUserPropertyListingStatuses(UUID userId) {
        return propertyListingRepository.findDistinctStatusesByUserId(userId);
    }

    public List<CompactPropertyListingResponse> getUserPropertyListings(UUID userId) {
        List<PropertyListing> listings = propertyListingRepository.findBySeller_Id(userId);
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getPublishedPropertyListingsByUser(UUID userId) {
        List<PropertyListing> listings = propertyListingRepository.findAllBySellerAndStatus(userId, PropertyListingStatus.PUBLISHED);
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePropertyListing(UUID id) {

        boolean exists = propertySubmissionReviewRepository.existsById(id);
        if (exists)
            propertySubmissionReviewService.deletePropertySubmissionReview(id);

        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));

        propertyListingRepository.delete(propertyListing);
    }

    @Transactional
    public void toggleSaveProperty(UUID propertyListingId, UUID userId) {
        PropertyListing listing = propertyListingRepository
        .findById(propertyListingId)
        .orElseThrow(() -> new RuntimeException("Listing not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> savedBy = listing.getSavedByUsers();
        if (savedBy == null) {
            savedBy = new ArrayList<>();
            listing.setSavedByUsers(savedBy);
        }

        if (savedBy.contains(user)) {
            savedBy.remove(user); // Unsave
        } else {
            savedBy.add(user); // Save
        }

        propertyListingRepository.save(listing);
    }

    public List<UUID> getUserSavedPropertyIds(UUID userId) {
        if (!userRepository.existsById(userId)) {
             throw new RuntimeException("User not found");
        }
        return propertyListingRepository.findSavedListingIdsByUserId(userId);
    }

    public List<CompactPropertyListingResponse> getSavedPropertyListings(UUID userId) {
        if (!userRepository.existsById(userId)) {
             throw new RuntimeException("User not found");
        }
        List<PropertyListing> listings = propertyListingRepository.findAllBySavedByUsers_Id(userId);
        return listings.stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public Page<CompactPropertyListingResponse> getSearchedProperties(PropertySearchParams searchParams, Pageable pageable) {
        Page<CompactPropertyListingResponse> properties = Page.empty();
        Page<PropertyListing> propertyPage;
        try {
            propertyPage = propertyListingRepository.SearchPropertiesBySearchParams(searchParams, pageable);
        } catch (Exception e) {
            logger.error("Error during property search: {}", e.getMessage());
            return properties;
        }
        return propertyPage.map(propertyListingMapper::toCompactResponse);
    }
}
