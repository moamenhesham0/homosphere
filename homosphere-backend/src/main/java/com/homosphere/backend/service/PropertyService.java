package com.homosphere.backend.service;

import java.time.Year;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.homosphere.backend.enums.PropertyCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyAdminResponse;
import com.homosphere.backend.dto.property.response.PropertyAdminStatusCountsResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.enums.PropertyType;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyListingRepository propertyListingRepository;
    private final PropertyListingMapper propertyListingMapper;

    public Page<CompactPropertyListingResponse> searchProperties(String userInput, Pageable pageable) {
        if (userInput == null || userInput.trim().isEmpty()) {
            return Page.empty(pageable);
        }
        Page<PropertyListing> propertyListings = propertyRepository.searchPropertyListings(userInput.trim(), pageable);
        List<CompactPropertyListingResponse> responses = propertyListings.getContent().stream()
            .map(propertyListingMapper::toCompactResponse)
            .toList();
        return new PageImpl<>(responses, pageable, propertyListings.getTotalElements());
    }

    public Page<CompactPropertyListingResponse> filterProperties(
            Integer bedrooms,
            Integer bathrooms,
            Double minPrice,
            Double maxPrice,
            Integer age,
            String city,
            String state,
            Pageable pageable) {
        Integer minYear = null;
        Integer maxYear = null;
        if (age != null) {
            int currentYear = Year.now().getValue();
            minYear = currentYear - age;
            maxYear = currentYear;
        }
        Page<PropertyListing> propertyListings = propertyRepository.filterPropertyListings(
            bedrooms, bathrooms, minPrice, maxPrice, minYear, maxYear, city, state, pageable);
        List<CompactPropertyListingResponse> responses = propertyListings.getContent().stream()
            .map(propertyListingMapper::toCompactResponse)
            .toList();
        return new PageImpl<>(responses, pageable, propertyListings.getTotalElements());
    }

    public PropertyListingResponse getPropertyListingDetails(UUID propertyListingId) {
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property listing not found"));
        return propertyListingMapper.toResponse(propertyListing);
    }

    public List<String> getAllPropertyTypes() {
        return Arrays.stream(PropertyType.values())
                .map(PropertyType::name)
                .toList();
    }

    public List<String> getAllConditions() {
        return Arrays.stream(PropertyCondition.values())
                .map(PropertyCondition::name)
                .toList();
    }

    public PropertyAdminResponse getAllPropertiesPartitionedByStatus() {
        List<PropertyListing> allListings = propertyListingRepository.findAll();
        EnumMap<PropertyListingStatus, List<CompactPropertyListingResponse>> partitioned = new EnumMap<>(PropertyListingStatus.class);
        for (PropertyListingStatus status : PropertyListingStatus.values()) {
            List<CompactPropertyListingResponse> list = allListings.stream()
                .filter(pl -> pl.getStatus() == status)
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
            partitioned.put(status, list);
        }
        return new PropertyAdminResponse(partitioned);
    }

    public List<CompactPropertyListingResponse> getAllPendingProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.PENDING)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public Page<CompactPropertyListingResponse> getPendingPropertiesPage(Pageable pageable) {
        Page<PropertyListing> listings = propertyListingRepository.findByStatus(PropertyListingStatus.PENDING, pageable);
        return listings.map(propertyListingMapper::toCompactResponse);
    }

    public PropertyAdminStatusCountsResponse getAdminStatusCounts() {
        long pending = propertyListingRepository.countByStatus(PropertyListingStatus.PENDING);
        long flagged = propertyListingRepository.countByStatus(PropertyListingStatus.REQUIRES_CHANGES);
        long processed = propertyListingRepository.countByStatus(PropertyListingStatus.PUBLISHED)
                + propertyListingRepository.countByStatus(PropertyListingStatus.REJECTED);

        return new PropertyAdminStatusCountsResponse(pending, flagged, processed);
    }

    public List<CompactPropertyListingResponse> getAllPublishedProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.PUBLISHED)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllRejectedProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.REJECTED)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllRequiresChangesProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.REQUIRES_CHANGES)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllUnlistedProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.UNLISTED)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public List<CompactPropertyListingResponse> getAllSoldProperties() {
        return propertyListingRepository.findByStatus(PropertyListingStatus.SOLD)
                .stream()
                .map(propertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    public void updatePropertyListingStatus(UUID propertyListingId, PropertyListingStatus status) {
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property listing not found"));
        propertyListing.setStatus(status);
        propertyListingRepository.save(propertyListing);
    }

}
