package com.homosphere.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.LocationRequest;
import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.dto.property.request.PropertyRequest;
import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.enums.PropertyType;
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

@ExtendWith(MockitoExtension.class)
class PropertyListingServiceTest {

    @Mock
    private PropertyListingRepository propertyListingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private PropertyListingMapper propertyListingMapper;

    @Mock
    private CompactPropertyListingMapper compactPropertyListingMapper;

    @Mock
    private PropertyMapper propertyMapper;

    @Mock
    private LocationMapper locationMapper;

    @Mock
    private PropertyImageMapper propertyImageMapper;

    @InjectMocks
    private PropertyListingService propertyListingService;

    private PropertyListingRequest propertyListingRequest;
    private User seller;
    private Property property;
    private Location location;
    private PropertyListing propertyListing;
    private PropertyListingResponse propertyListingResponse;

    @BeforeEach
    void setUp() {
        // Setup test data
        UUID sellerId = UUID.randomUUID();
        UUID propertyId = UUID.randomUUID();
        UUID locationId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();

        // Create seller
        seller = new User();
        seller.setId(sellerId);
        seller.setEmail("seller@test.com");
        seller.setFirstName("Test");
        seller.setLastName("Seller");

        // Create location DTO
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setLatitude(40.7128);
        locationRequest.setLongitude(-74.0060);
        locationRequest.setStreet("123 Test St");
        locationRequest.setCity("New York");
        locationRequest.setState("NY");
        locationRequest.setZipCode("10001");

        // Create location entity
        location = new Location();
        location.setLocationId(locationId);
        location.setLatitude(40.7128);
        location.setLongitude(-74.0060);
        location.setStreet("123 Test St");
        location.setCity("New York");
        location.setState("NY");
        location.setZipCode("10001");

        // Create property DTO
        PropertyRequest propertyRequest = new PropertyRequest();
        propertyRequest.setAreaInSquareMeters(100.0);
        propertyRequest.setBedrooms(3);
        propertyRequest.setBathrooms(2);
        propertyRequest.setPropertyType(PropertyType.APARTMENT);
        propertyRequest.setPropertyCondition(PropertyCondition.GOOD);
        propertyRequest.setLocation(locationRequest);
        propertyRequest.setAmenities(new ArrayList<>());

        // Create property entity
        property = new Property();
        property.setPropertyId(propertyId);
        property.setAreaInSquareMeters(100.0);
        property.setBedrooms(3);
        property.setBathrooms(2);
        property.setType(PropertyType.APARTMENT);
        property.setCondition(PropertyCondition.GOOD);
        property.setLocation(location);

        // Create banner image
        PropertyImageRequest bannerImageRequest = new PropertyImageRequest();
        bannerImageRequest.setImageUrl("https://example.com/banner.jpg");

        // Create property images
        PropertyImageRequest image1 = new PropertyImageRequest();
        image1.setImageUrl("https://example.com/image1.jpg");
        PropertyImageRequest image2 = new PropertyImageRequest();
        image2.setImageUrl("https://example.com/image2.jpg");
        List<PropertyImageRequest> propertyImageRequests = Arrays.asList(image1, image2);

        // Create property listing request
        propertyListingRequest = new PropertyListingRequest();
        propertyListingRequest.setTitle("Beautiful Apartment");
        propertyListingRequest.setDescription("A stunning apartment in the heart of the city");
        propertyListingRequest.setPrice(500000.0);
        propertyListingRequest.setSellerId(sellerId);
        propertyListingRequest.setProperty(propertyRequest);
        propertyListingRequest.setBannerImage(bannerImageRequest);
        propertyListingRequest.setPropertyImages(propertyImageRequests);
        propertyListingRequest.setPropertyListingStatus(PropertyListingStatus.PUBLISHED);

        // Create property listing entity
        propertyListing = new PropertyListing();
        propertyListing.setPropertyListingId(listingId);
        propertyListing.setTitle("Beautiful Apartment");
        propertyListing.setDescription("A stunning apartment in the heart of the city");
        propertyListing.setPrice(500000.0);
        propertyListing.setSeller(seller);
        propertyListing.setProperty(property);
        propertyListing.setPropertyListingStatus(PropertyListingStatus.PUBLISHED);
        propertyListing.setViews(0);
        propertyListing.setPublicationDate(LocalDateTime.now());
        propertyListing.setLastUpdatedDate(LocalDateTime.now());

        // Create response
        propertyListingResponse = new PropertyListingResponse();
        propertyListingResponse.setPropertyListingId(listingId);
        propertyListingResponse.setTitle("Beautiful Apartment");
        propertyListingResponse.setDescription("A stunning apartment in the heart of the city");
        propertyListingResponse.setPrice(500000.0);
    }

    @Test
    void createPropertyListing_Success() {
        // Arrange
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(seller));
        when(propertyMapper.toEntity(any())).thenReturn(property);
        when(locationMapper.toEntity(any())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyImageMapper.toEntity(any(PropertyImageRequest.class)))
                .thenReturn(new PropertyImage());
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.createPropertyListing(propertyListingRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Beautiful Apartment", result.getTitle());
        assertEquals(500000.0, result.getPrice());
        verify(userRepository, times(1)).findById(any(UUID.class));
        verify(propertyRepository, times(1)).save(any(Property.class));
        verify(locationRepository, times(1)).save(any(Location.class));
        verify(propertyListingRepository, times(2)).save(any(PropertyListing.class)); // Called twice: once before images, once after
    }

    @Test
    void createPropertyListing_SellerNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            propertyListingService.createPropertyListing(propertyListingRequest)
        );
        verify(propertyListingRepository, never()).save(any());
    }

    @Test
    void createPropertyListing_WithoutLocation_Success() {
        // Arrange
        propertyListingRequest.getProperty().setLocation(null);
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(seller));
        when(propertyMapper.toEntity(any())).thenReturn(property);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.createPropertyListing(propertyListingRequest);

        // Assert
        assertNotNull(result);
        verify(locationRepository, never()).save(any());
    }

    @Test
    void createPropertyListing_WithoutBannerImage_Success() {
        // Arrange
        propertyListingRequest.setBannerImage(null);
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(seller));
        when(propertyMapper.toEntity(any())).thenReturn(property);
        when(locationMapper.toEntity(any())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyImageMapper.toEntity(any(PropertyImageRequest.class))).thenReturn(new PropertyImage());
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.createPropertyListing(propertyListingRequest);

        // Assert
        assertNotNull(result);
        // Property images are still set, so mapper is called
        verify(propertyImageMapper, times(2)).toEntity(any(PropertyImageRequest.class));
    }

    @Test
    void createPropertyListing_WithoutPropertyImages_Success() {
        // Arrange
        propertyListingRequest.setPropertyImages(new ArrayList<>());
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(seller));
        when(propertyMapper.toEntity(any())).thenReturn(property);
        when(locationMapper.toEntity(any())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyImageMapper.toEntity(any(PropertyImageRequest.class))).thenReturn(new PropertyImage());
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.createPropertyListing(propertyListingRequest);

        // Assert
        assertNotNull(result);
    }

    @Test
    void createPropertyListing_DefaultStatus_Success() {
        // Arrange
        propertyListingRequest.setPropertyListingStatus(null);
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.of(seller));
        when(propertyMapper.toEntity(any())).thenReturn(property);
        when(locationMapper.toEntity(any())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.createPropertyListing(propertyListingRequest);

        // Assert
        assertNotNull(result);
    }

    @Test
    void getPropertyListingById_Success() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.of(propertyListing));
        when(propertyListingMapper.toResponse(propertyListing)).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.getPropertyListingById(listingId);

        // Assert
        assertNotNull(result);
        assertEquals("Beautiful Apartment", result.getTitle());
        verify(propertyListingRepository, times(1)).findById(listingId);
    }

    @Test
    void getPropertyListingById_NotFound_ThrowsException() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            propertyListingService.getPropertyListingById(listingId)
        );
    }

    @Test
    void getAllPropertyListings_Success() {
        // Arrange
        List<PropertyListing> listings = Arrays.asList(propertyListing, propertyListing);
        CompactPropertyListingResponse compactResponse = new CompactPropertyListingResponse();
        compactResponse.setTitle("Beautiful Apartment");

        when(propertyListingRepository.findAll()).thenReturn(listings);
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
                .thenReturn(compactResponse);

        // Act
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPropertyListings();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(propertyListingRepository, times(1)).findAll();
    }

    @Test
    void getAllPropertyListings_EmptyList() {
        // Arrange
        when(propertyListingRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPropertyListings();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void updatePropertyListing_Success() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.of(propertyListing));
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.updatePropertyListing(listingId, propertyListingRequest);

        // Assert
        assertNotNull(result);
        verify(propertyListingRepository, times(1)).findById(listingId);
        verify(propertyListingRepository, times(1)).save(any(PropertyListing.class));
    }

    @Test
    void updatePropertyListing_NotFound_ThrowsException() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            propertyListingService.updatePropertyListing(listingId, propertyListingRequest)
        );
    }

    @Test
    void updatePropertyListing_WithNewLocation_Success() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        propertyListing.getProperty().setLocation(null);

        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.of(propertyListing));
        when(locationMapper.toEntity(any())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.updatePropertyListing(listingId, propertyListingRequest);

        // Assert
        assertNotNull(result);
        verify(locationRepository, times(1)).save(any(Location.class));
    }

    @Test
    void updatePropertyListing_WithPropertyImages_Success() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.of(propertyListing));
        when(propertyRepository.save(any(Property.class))).thenReturn(property);
        when(locationRepository.save(any(Location.class))).thenReturn(location);
        when(propertyImageMapper.toEntity(any(PropertyImageRequest.class))).thenReturn(new PropertyImage());
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any(PropertyListing.class))).thenReturn(propertyListingResponse);

        // Act
        PropertyListingResponse result = propertyListingService.updatePropertyListing(listingId, propertyListingRequest);

        // Assert
        assertNotNull(result);
        verify(propertyImageMapper, atLeastOnce()).toEntity(any(PropertyImageRequest.class));
    }

    @Test
    void deletePropertyListing_Success() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertyListingRepository).delete(propertyListing);

        // Act
        propertyListingService.deletePropertyListing(listingId);

        // Assert
        verify(propertyListingRepository, times(1)).findById(listingId);
        verify(propertyListingRepository, times(1)).delete(propertyListing);
    }

    @Test
    void deletePropertyListing_NotFound_ThrowsException() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        when(propertyListingRepository.findById(listingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
            propertyListingService.deletePropertyListing(listingId)
        );
        verify(propertyListingRepository, never()).delete(any());
    }
}
