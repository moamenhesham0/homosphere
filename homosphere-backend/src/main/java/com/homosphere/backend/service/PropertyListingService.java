package com.homosphere.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.mapper.CompactPropertyListingMapper;
import com.homosphere.backend.mapper.LocationMapper;
import com.homosphere.backend.mapper.PropertyImageMapper;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.mapper.PropertyMapper;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.model.User;
import com.homosphere.backend.repository.LocationRepository;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertyRepository;
import com.homosphere.backend.repository.UserRepository;

@Service
public class PropertyListingService {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private PropertyListingRepository propertyListingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PropertyListingMapper propertyListingMapper;

    @Autowired
    private CompactPropertyListingMapper compactPropertyListingMapper;

    @Autowired
    private PropertyMapper propertyMapper;

    @Autowired
    private LocationMapper locationMapper;

    @Autowired
    private PropertyImageMapper propertyImageMapper;

    @Transactional
    public PropertyListingResponse createPropertyListing(PropertyListingRequest request) {
        // Validate seller exists
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + request.getSellerId()));

        // Create Property entity
        Property property = propertyMapper.toEntity(request.getProperty());

        // Create and save Location
        if (request.getProperty().getLocation() != null) {
            Location location = locationMapper.toEntity(request.getProperty().getLocation());
            location = locationRepository.save(location);
            property.setLocation(location);
        }

        // Save Property
        property = propertyRepository.save(property);

        // Create PropertyListing entity (without images first to avoid FK issues)
        PropertyListing propertyListing = new PropertyListing();
        propertyListing.setTitle(request.getTitle());
        propertyListing.setDescription(request.getDescription());
        propertyListing.setPrice(request.getPrice());
        propertyListing.setSeller(seller);
        propertyListing.setProperty(property);
        propertyListing.setPropertyListingStatus(request.getPropertyListingStatus() != null ?
            request.getPropertyListingStatus() : PropertyListingStatus.PENDING);
        propertyListing.setViews(0);
        propertyListing.setPublicationDate(LocalDateTime.now());
        propertyListing.setLastUpdatedDate(LocalDateTime.now());

        // Handle banner image if provided
        if (request.getBannerImage() != null) {
            PropertyImage bannerImage = propertyImageMapper.toEntity(request.getBannerImage());
            propertyListing.setBannerImage(bannerImage);
        }

        // Save PropertyListing first (without property images to get the ID)
        PropertyListing savedListing = propertyListingRepository.save(propertyListing);

        // Handle property images if provided - set listing ID after save
        if (request.getPropertyImages() != null && !request.getPropertyImages().isEmpty()) {
            final UUID listingId = savedListing.getPropertyListingId();
            List<PropertyImage> propertyImages = request.getPropertyImages().stream()
                .map(propertyImageMapper::toEntity)
                .filter(image -> image != null)  // Filter out any null images
                .peek(image -> image.setPropertyListingId(listingId))
                .collect(java.util.stream.Collectors.toList());
            savedListing.setPropertyImages(propertyImages);
            // Save again with images
            savedListing = propertyListingRepository.save(savedListing);
        }

        // Map to response DTO
        return propertyListingMapper.toResponse(savedListing);
    }

    public PropertyListingResponse getPropertyListingById(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        return propertyListingMapper.toResponse(propertyListing);
    }

    public List<CompactPropertyListingResponse> getAllPropertyListings() {
        List<PropertyListing> listings = propertyListingRepository.findAll();
        return listings.stream()
                .map(compactPropertyListingMapper::toCompactResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyListingResponse updatePropertyListing(UUID id, PropertyListingRequest request) {
        PropertyListing existingListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));

        // Update basic fields
        existingListing.setTitle(request.getTitle());
        existingListing.setDescription(request.getDescription());
        existingListing.setPrice(request.getPrice());
        existingListing.setLastUpdatedDate(LocalDateTime.now());

        // Update property if provided
        if (request.getProperty() != null) {
            Property property = existingListing.getProperty();
            if (property == null) {
                property = propertyMapper.toEntity(request.getProperty());
            } else {
                // Update existing property fields
                property.setAreaInSquareMeters(request.getProperty().getAreaInSquareMeters());
                property.setBedrooms(request.getProperty().getBedrooms());
                property.setBathrooms(request.getProperty().getBathrooms());
                property.setType(request.getProperty().getPropertyType());
                property.setYearBuilt(request.getProperty().getYearBuilt());
                property.setCondition(request.getProperty().getPropertyCondition());

                // Update location
                if (request.getProperty().getLocation() != null) {
                    Location location = property.getLocation();
                    if (location == null) {
                        location = locationMapper.toEntity(request.getProperty().getLocation());
                    } else {
                        location.setLatitude(request.getProperty().getLocation().getLatitude());
                        location.setLongitude(request.getProperty().getLocation().getLongitude());
                        location.setCity(request.getProperty().getLocation().getCity());
                        location.setState(request.getProperty().getLocation().getState());
                    }
                    location = locationRepository.save(location);
                    property.setLocation(location);
                }
            }
            property = propertyRepository.save(property);
            existingListing.setProperty(property);
        }

        // Update banner image if provided
        if (request.getBannerImage() != null) {
            PropertyImage bannerImage = propertyImageMapper.toEntity(request.getBannerImage());
            existingListing.setBannerImage(bannerImage);
        }

        // Update property images if provided
        if (request.getPropertyImages() != null && !request.getPropertyImages().isEmpty()) {
            final UUID listingId = existingListing.getPropertyListingId();
            List<PropertyImage> images = request.getPropertyImages().stream()
                    .map(propertyImageMapper::toEntity)
                    .filter(image -> image != null)  // Filter out any null images
                    .peek(image -> image.setPropertyListingId(listingId))
                    .collect(Collectors.toList());
            existingListing.setPropertyImages(images);
        }

        PropertyListing updatedListing = propertyListingRepository.save(existingListing);
        return propertyListingMapper.toResponse(updatedListing);
    }

    @Transactional
    public void deletePropertyListing(UUID id) {
        PropertyListing propertyListing = propertyListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property listing not found with ID: " + id));
        propertyListingRepository.delete(propertyListing);
    }
}
