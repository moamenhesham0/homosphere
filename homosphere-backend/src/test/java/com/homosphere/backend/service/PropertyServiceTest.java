package com.homosphere.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyAdminResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertyRepository;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {
    @Test
    void getPropertyListingDetails_ReturnsResponse_WhenFound() {
        UUID id = UUID.randomUUID();
        PropertyListing propertyListing = new PropertyListing();
        PropertyListingResponse response = mock(com.homosphere.backend.dto.property.response.PropertyListingResponse.class);
        PropertyListingRepository propertyListingRepository = mock(com.homosphere.backend.repository.PropertyListingRepository.class);
        PropertyListingMapper propertyListingMapper = mock(PropertyListingMapper.class);
        PropertyService service = new PropertyService(propertyRepository, propertyListingRepository, propertyListingMapper);
        when(propertyListingRepository.findById(id)).thenReturn(java.util.Optional.of(propertyListing));
        when(propertyListingMapper.toResponse(propertyListing)).thenReturn(response);
        assertEquals(response, service.getPropertyListingDetails(id));
    }

    @Test
    void getPropertyListingDetails_Throws_WhenNotFound() {
        UUID id = UUID.randomUUID();
        PropertyListingRepository propertyListingRepository = mock(com.homosphere.backend.repository.PropertyListingRepository.class);
        PropertyListingMapper propertyListingMapper = mock(PropertyListingMapper.class);
        PropertyService service = new PropertyService(propertyRepository, propertyListingRepository, propertyListingMapper);
        when(propertyListingRepository.findById(id)).thenReturn(java.util.Optional.empty());
        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> service.getPropertyListingDetails(id));
    }

    @Test
    void getAllPropertyTypes_ReturnsAllEnumNames() {
        List<String> types = propertyService.getAllPropertyTypes();
        for (com.homosphere.backend.enums.PropertyType type : com.homosphere.backend.enums.PropertyType.values()) {
            assertTrue(types.contains(type.name()));
        }
    }

    @Test
    void getAllConditions_ReturnsAllEnumNames() {
        List<String> conditions = propertyService.getAllConditions();
        for (com.homosphere.backend.enums.PropertyCondition cond : com.homosphere.backend.enums.PropertyCondition.values()) {
            assertTrue(conditions.contains(cond.name()));
        }
    }

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private PropertyListingRepository propertyListingRepository;

    @Mock
    private PropertyListingMapper propertyListingMapper;

    @InjectMocks
    private PropertyService propertyService;

    private PropertyListing propertyListing;
    private CompactPropertyListingResponse compactResponse;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Create test data
        Location location = new Location();
        location.setLocationId(UUID.randomUUID());
        location.setCity("New York");
        location.setState("NY");

        Property property = new Property();
        property.setPropertyId(UUID.randomUUID());
        property.setBedrooms(3);
        property.setBathrooms(2);
        property.setLocation(location);

        propertyListing = new PropertyListing();
        propertyListing.setPropertyListingId(UUID.randomUUID());
        propertyListing.setTitle("3 Bed Apartment");
        propertyListing.setPrice(850000.0);
        propertyListing.setProperty(property);

        compactResponse = new CompactPropertyListingResponse();
        compactResponse.setPropertyListingId(propertyListing.getPropertyListingId());
        compactResponse.setTitle("3 Bed Apartment");
        compactResponse.setPrice(850000.0);
        compactResponse.setBedrooms(3);
        compactResponse.setBathrooms(2);
        compactResponse.setCity("New York");
        compactResponse.setState("NY");

        pageable = PageRequest.of(0, 8);
    }

    @Test
    void searchProperties_WithValidInput_ReturnsPageOfResults() {
        // Arrange
        String query = "New York";
        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.searchPropertyListings(eq(query), any(Pageable.class)))
            .thenReturn(propertyPage);
        when(propertyListingMapper.toCompactResponse(propertyListing))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(query, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("3 Bed Apartment", result.getContent().get(0).getTitle());
        verify(propertyRepository, times(1)).searchPropertyListings(query, pageable);
        verify(propertyListingMapper, times(1)).toCompactResponse(propertyListing);
    }

    @Test
    void searchProperties_WithNullInput_ReturnsEmptyPage() {
        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(null, pageable);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyRepository, never()).searchPropertyListings(anyString(), any(Pageable.class));
    }

    @Test
    void searchProperties_WithEmptyInput_ReturnsEmptyPage() {
        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties("", pageable);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyRepository, never()).searchPropertyListings(anyString(), any(Pageable.class));
    }

    @Test
    void searchProperties_WithWhitespaceInput_ReturnsEmptyPage() {
        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties("   ", pageable);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyRepository, never()).searchPropertyListings(anyString(), any(Pageable.class));
    }

    @Test
    void searchProperties_WithNoResults_ReturnsEmptyPage() {
        // Arrange
        String query = "NonExistentCity";
        Page<PropertyListing> emptyPage = new PageImpl<>(Collections.emptyList());

        when(propertyRepository.searchPropertyListings(eq(query), any(Pageable.class)))
            .thenReturn(emptyPage);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(query, pageable);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyRepository, times(1)).searchPropertyListings(query, pageable);
    }

    @Test
    void searchProperties_WithMultipleResults_ReturnsAllResults() {
        // Arrange
        String query = "apartment";
        PropertyListing listing2 = new PropertyListing();
        listing2.setPropertyListingId(UUID.randomUUID());
        listing2.setTitle("4 Bed Apartment");

        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing, listing2));

        when(propertyRepository.searchPropertyListings(eq(query), any(Pageable.class)))
            .thenReturn(propertyPage);
        when(propertyListingMapper.toCompactResponse(propertyListing)).thenReturn(compactResponse);
        CompactPropertyListingResponse compactResponse2 = new CompactPropertyListingResponse();
        compactResponse2.setPropertyListingId(listing2.getPropertyListingId());
        compactResponse2.setTitle("4 Bed Apartment");
        when(propertyListingMapper.toCompactResponse(listing2)).thenReturn(compactResponse2);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(query, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(propertyRepository, times(1)).searchPropertyListings(query, pageable);
        verify(propertyListingMapper, times(1)).toCompactResponse(propertyListing);
        verify(propertyListingMapper, times(1)).toCompactResponse(listing2);
    }

    @Test
    void filterProperties_WithAllParameters_ReturnsFilteredResults() {
        // Arrange
        Integer bedrooms = 3;
        Integer bathrooms = 2;
        Double minPrice = 500000.0;
        Double maxPrice = 1000000.0;
        Integer age = 5;
        String city = "New York";
        String state = "NY";

        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.filterPropertyListings(
            anyInt(), anyInt(), anyDouble(), anyDouble(),
            anyInt(), anyInt(), anyString(), anyString(), any(Pageable.class)))
            .thenReturn(propertyPage);
        org.mockito.Mockito.lenient().when(propertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            bedrooms, bathrooms, minPrice, maxPrice, age, city, state, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(propertyRepository, times(1)).filterPropertyListings(
            eq(bedrooms), eq(bathrooms), eq(minPrice), eq(maxPrice),
            anyInt(), anyInt(), eq(city), eq(state), eq(pageable));
    }

    @Test
    void filterProperties_WithNullParameters_CallsRepositoryWithNulls() {
        // Arrange
        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.filterPropertyListings(
            isNull(), isNull(), isNull(), isNull(),
            isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(propertyPage);
        org.mockito.Mockito.lenient().when(propertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            null, null, null, null, null, null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(propertyRepository, times(1)).filterPropertyListings(
            isNull(), isNull(), isNull(), isNull(),
            isNull(), isNull(), isNull(), isNull(), eq(pageable));
    }

    @Test
    void filterProperties_WithAgeParameter_CalculatesYearCorrectly() {
        // Arrange
        Integer age = 10;
        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.filterPropertyListings(
            any(), any(), any(), any(), anyInt(), anyInt(), any(), any(), any(Pageable.class)))
            .thenReturn(propertyPage);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            null, null, null, null, age, null, null, pageable);

        // Assert
        assertNotNull(result);
        verify(propertyRepository, times(1)).filterPropertyListings(
            any(), any(), any(), any(), anyInt(), anyInt(), any(), any(), eq(pageable));
    }

    @Test
    void filterProperties_WithNoResults_ReturnsEmptyPage() {
        // Arrange
        Page<PropertyListing> emptyPage = new PageImpl<>(Collections.emptyList());

        when(propertyRepository.filterPropertyListings(
            any(), any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(emptyPage);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            3, 2, 500000.0, 1000000.0, 5, "NonExistent", "XX", pageable);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(propertyRepository, times(1)).filterPropertyListings(
            any(), any(), any(), any(), any(), any(), any(), any(), eq(pageable));
    }

    @Test
    void filterProperties_WithOnlyBedroomsFilter_ReturnsFilteredResults() {
        // Arrange
        Integer bedrooms = 3;
        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.filterPropertyListings(
            eq(bedrooms), isNull(), isNull(), isNull(),
            isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(propertyPage);
        org.mockito.Mockito.lenient().when(propertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            bedrooms, null, null, null, null, null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(propertyRepository, times(1)).filterPropertyListings(
            eq(bedrooms), isNull(), isNull(), isNull(),
            isNull(), isNull(), isNull(), isNull(), eq(pageable));
    }

    @Test
    void filterProperties_WithPriceRangeOnly_ReturnsFilteredResults() {
        // Arrange
        Double minPrice = 500000.0;
        Double maxPrice = 1000000.0;
        Page<PropertyListing> propertyPage = new PageImpl<>(List.of(propertyListing));

        when(propertyRepository.filterPropertyListings(
            isNull(), isNull(), eq(minPrice), eq(maxPrice),
            isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(propertyPage);
        org.mockito.Mockito.lenient().when(propertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.filterProperties(
            null, null, minPrice, maxPrice, null, null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(propertyRepository, times(1)).filterPropertyListings(
            isNull(), isNull(), eq(minPrice), eq(maxPrice),
            isNull(), isNull(), isNull(), isNull(), eq(pageable));
    }

    @Test
    void getAllPropertiesPartitionedByStatus_ReturnsPartitionedResponse() {
        // Arrange
        PropertyListing listing1 = new PropertyListing();
        listing1.setStatus(PropertyListingStatus.PENDING);
        PropertyListing listing2 = new PropertyListing();
        listing2.setStatus(PropertyListingStatus.PUBLISHED);
        PropertyListing listing3 = new PropertyListing();
        listing3.setStatus(PropertyListingStatus.REJECTED);
        List<PropertyListing> allListings = List.of(listing1, listing2, listing3);
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findAll()).thenReturn(allListings);

        // Act
        PropertyAdminResponse response = propertyService.getAllPropertiesPartitionedByStatus();

        // Assert
        assertNotNull(response);
        for (PropertyListingStatus status : PropertyListingStatus.values()) {
            assertNotNull(response.getPropertiesByStatus().get(status));
        }
    }

    @Test
    void getAllPendingProperties_ReturnsPendingList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.PENDING)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllPendingProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.PENDING);
    }

    @Test
    void getAllPublishedProperties_ReturnsPublishedList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.PUBLISHED)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllPublishedProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.PUBLISHED);
    }

    @Test
    void getAllRejectedProperties_ReturnsRejectedList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.REJECTED)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllRejectedProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.REJECTED);
    }

    @Test
    void getAllRequiresChangesProperties_ReturnsRequiresChangesList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.REQUIRES_CHANGES)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllRequiresChangesProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.REQUIRES_CHANGES);
    }

    @Test
    void getAllUnlistedProperties_ReturnsUnlistedList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.UNLISTED)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllUnlistedProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.UNLISTED);
    }

    @Test
    void getAllSoldProperties_ReturnsSoldList() {
        // Arrange
        when(propertyListingMapper.toCompactResponse(any(PropertyListing.class))).thenReturn(compactResponse);
        when(propertyListingRepository.findByStatus(PropertyListingStatus.SOLD)).thenReturn(List.of(propertyListing));

        // Act
        List<CompactPropertyListingResponse> result = propertyService.getAllSoldProperties();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(propertyListingRepository, times(1)).findByStatus(PropertyListingStatus.SOLD);
    }

    @Test
    void updatePropertyListingStatus_UpdatesStatusSuccessfully() {
        // Arrange
        UUID id = UUID.randomUUID();
        PropertyListing listing = new PropertyListing();
        listing.setPropertyListingId(id);
        when(propertyListingRepository.findById(id)).thenReturn(java.util.Optional.of(listing));
        when(propertyListingRepository.save(listing)).thenReturn(listing);

        // Act
        propertyService.updatePropertyListingStatus(id, PropertyListingStatus.PUBLISHED);

        // Assert
        assertEquals(PropertyListingStatus.PUBLISHED, listing.getStatus());
        verify(propertyListingRepository, times(1)).findById(id);
        verify(propertyListingRepository, times(1)).save(listing);
    }

    @Test
    void updatePropertyListingStatus_ThrowsIfNotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(propertyListingRepository.findById(id)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        assertThrows(org.springframework.web.server.ResponseStatusException.class, () ->
            propertyService.updatePropertyListingStatus(id, PropertyListingStatus.PUBLISHED));
        verify(propertyListingRepository, times(1)).findById(id);
    }
}