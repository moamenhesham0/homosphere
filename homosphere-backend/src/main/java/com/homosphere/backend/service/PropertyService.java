package com.homosphere.backend.service;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.mapper.CompactPropertyListingMapper;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyRepository;
import com.homosphere.backend.repository.PropertyListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Year;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyListingRepository propertyListingRepository;
    private final CompactPropertyListingMapper compactPropertyListingMapper;
    private final PropertyListingMapper propertyListingMapper;

    public Page<CompactPropertyListingResponse> searchProperties(String userInput, Pageable pageable) {
        if (userInput == null || userInput.trim().isEmpty()) {
            return Page.empty(pageable);
        }
        Page<PropertyListing> propertyListings = propertyRepository.searchPropertyListings(userInput.trim(), pageable);
        return propertyListings.map(compactPropertyListingMapper::toCompactResponse);
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
        return propertyListings.map(compactPropertyListingMapper::toCompactResponse);
    }

    public PropertyListingResponse getPropertyListingDetails(UUID propertyListingId) {
        PropertyListing propertyListing = propertyListingRepository.findById(propertyListingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property listing not found"));
        return propertyListingMapper.toResponse(propertyListing);
    }
}
