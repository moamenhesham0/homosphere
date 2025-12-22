package com.homosphere.backend.service;

import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.updater.PropertyListingUpdater;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PropertyListingService {

    private final PropertyListingRepository propertyListingRepository;

    private final PropertyListingMapper propertyListingMapper;

    private final PropertyListingUpdater propertyListingUpdater;

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
    public PropertyListingResponse updatePropertyListingDraft(PropertyListingDraftRequest draftRequest) {
        final UUID propertyListingId = draftRequest.getPropertyListingId();
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + propertyListingId));

        try {
            propertyListingUpdater.applyDraft(propertyListing, draftRequest);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

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
        return propertyListingMapper.toPublicResponse(propertyListing);
    }

    public PropertyListingPublicResponse getPublicPropertyListingById(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
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

    @Transactional
    public void deletePropertyListing(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        propertyListingRepository.delete(propertyListing);
    }

}
