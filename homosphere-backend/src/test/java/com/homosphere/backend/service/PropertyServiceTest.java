package com.homosphere.backend.service;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.mapper.CompactPropertyListingMapper;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private CompactPropertyListingMapper compactPropertyListingMapper;

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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(query, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("3 Bed Apartment", result.getContent().get(0).getTitle());
        verify(propertyRepository, times(1)).searchPropertyListings(query, pageable);
        verify(compactPropertyListingMapper, times(1)).toCompactResponse(propertyListing);
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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

        // Act
        Page<CompactPropertyListingResponse> result = propertyService.searchProperties(query, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(propertyRepository, times(1)).searchPropertyListings(query, pageable);
        verify(compactPropertyListingMapper, times(2)).toCompactResponse(any(PropertyListing.class));
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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
            .thenReturn(compactResponse);

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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
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
        when(compactPropertyListingMapper.toCompactResponse(any(PropertyListing.class)))
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
}