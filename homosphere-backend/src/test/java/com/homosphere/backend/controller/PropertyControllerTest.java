package com.homosphere.backend.controller;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = PropertyController.class,
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.JwtAuthenticationFilter.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CorsConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.ApplicationConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareR2Config.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareProperties.class)
    }
)
@AutoConfigureMockMvc(addFilters = false)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyService propertyService;

    // If your controller uses other beans (e.g., mappers, security), add @MockBean for them here
    // Example: @MockBean private CompactPropertyListingMapper compactPropertyListingMapper;

    private CompactPropertyListingResponse compactResponse;
    private Page<CompactPropertyListingResponse> responsePage;

    @BeforeEach
    void setUp() {
        // Create sample response
        compactResponse = new CompactPropertyListingResponse();
        compactResponse.setPropertyListingId(UUID.randomUUID());
        compactResponse.setTitle("3 Bed Apartment in New York");
        compactResponse.setPrice(850000.0);
        compactResponse.setBedrooms(3);
        compactResponse.setBathrooms(2);
        compactResponse.setCity("New York");
        compactResponse.setState("NY");

        // Create page response
        responsePage = new PageImpl<>(
            List.of(compactResponse), 
            PageRequest.of(0, 8), 
            1
        );
    }

    // ==================== SEARCH ENDPOINT TESTS ====================

    @Test
    void searchProperties_WithValidQuery_ReturnsOkAndData() throws Exception {
        // Arrange
        when(propertyService.searchProperties(eq("New York"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "New York")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("3 Bed Apartment in New York"))
                .andExpect(jsonPath("$.content[0].price").value(850000.0))
                .andExpect(jsonPath("$.content[0].bedrooms").value(3))
                .andExpect(jsonPath("$.content[0].bathrooms").value(2))
                .andExpect(jsonPath("$.content[0].city").value("New York"))
                .andExpect(jsonPath("$.content[0].state").value("NY"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.size").value(8));

        verify(propertyService, times(1))
            .searchProperties(eq("New York"), any(Pageable.class));
    }

    @Test
    void searchProperties_WithPageParameter_UsesCorrectPage() throws Exception {
        // Arrange
        when(propertyService.searchProperties(eq("apartment"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "apartment")
                .param("page", "2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1))
            .searchProperties(eq("apartment"), eq(PageRequest.of(2, 8)));
    }

    @Test
    void searchProperties_WithCustomPageSize_UsesCorrectSize() throws Exception {
        // Arrange
        when(propertyService.searchProperties(eq("house"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "house")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1))
            .searchProperties(eq("house"), eq(PageRequest.of(0, 10)));
    }

    @Test
    void searchProperties_WithDefaultParameters_UsesDefaults() throws Exception {
        // Arrange
        when(propertyService.searchProperties(eq("condo"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "condo")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1))
            .searchProperties(eq("condo"), eq(PageRequest.of(0, 8)));
    }

    @Test
    void searchProperties_WithEmptyResults_ReturnsEmptyPage() throws Exception {
        // Arrange
        Page<CompactPropertyListingResponse> emptyPage = Page.empty();
        when(propertyService.searchProperties(eq("NonExistent"), any(Pageable.class)))
            .thenReturn(emptyPage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "NonExistent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements").value(0))
                .andExpect(jsonPath("$.empty").value(true));

        verify(propertyService, times(1))
            .searchProperties(eq("NonExistent"), any(Pageable.class));
    }

    @Test
    void searchProperties_WithMultipleResults_ReturnsPaginatedResponse() throws Exception {
        // Arrange
        CompactPropertyListingResponse response2 = new CompactPropertyListingResponse();
        response2.setPropertyListingId(UUID.randomUUID());
        response2.setTitle("4 Bed House");
        response2.setPrice(1200000.0);
        response2.setBedrooms(4);
        response2.setBathrooms(3);
        response2.setCity("Los Angeles");
        response2.setState("CA");
        
        Page<CompactPropertyListingResponse> multiPage = new PageImpl<>(
            List.of(compactResponse, response2), 
            PageRequest.of(0, 8), 
            2
        );
        
        when(propertyService.searchProperties(eq("property"), any(Pageable.class)))
            .thenReturn(multiPage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "property")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].title").value("3 Bed Apartment in New York"))
                .andExpect(jsonPath("$.content[1].title").value("4 Bed House"))
                .andExpect(jsonPath("$.totalElements").value(2));

        verify(propertyService, times(1))
            .searchProperties(eq("property"), any(Pageable.class));
    }

    @Test
    void searchProperties_WithSpecialCharacters_HandlesCorrectly() throws Exception {
        // Arrange
        when(propertyService.searchProperties(eq("New York & Brooklyn"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/search")
                .param("q", "New York & Brooklyn")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1))
            .searchProperties(eq("New York & Brooklyn"), any(Pageable.class));
    }

    // ==================== FILTER ENDPOINT TESTS ====================

    @Test
    void filterProperties_WithAllParameters_ReturnsOkAndData() throws Exception {
        when(propertyService.filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(responsePage);

        mockMvc.perform(get("/api/properties/filter")
                .param("bedrooms", "3")
                .param("bathrooms", "2")
                .param("minPrice", "500000")
                .param("maxPrice", "1000000")
                .param("age", "5")
                .param("city", "New York")
                .param("state", "NY")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("3 Bed Apartment in New York"));

        verify(propertyService, times(1)).filterProperties(
            eq(3), eq(2), eq(500000.0), eq(1000000.0), eq(5), eq("New York"), eq("NY"), any(Pageable.class));
    }

    @Test
    void filterProperties_WithNoParameters_ReturnsAllProperties() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithOnlyBedrooms_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            eq(3), isNull(), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("bedrooms", "3")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        verify(propertyService, times(1)).filterProperties(
            eq(3), isNull(), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithOnlyBathrooms_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), eq(2), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("bathrooms", "2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        verify(propertyService, times(1)).filterProperties(
            isNull(), eq(2), isNull(), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithPriceRange_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), eq(500000.0), eq(1000000.0), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("minPrice", "500000")
                .param("maxPrice", "1000000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), eq(500000.0), eq(1000000.0), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithMinPriceOnly_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), eq(500000.0), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("minPrice", "500000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), eq(500000.0), isNull(), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithMaxPriceOnly_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), eq(1000000.0), 
            isNull(), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("maxPrice", "1000000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), eq(1000000.0), 
            isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithCityAndState_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), eq("New York"), eq("NY"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("city", "New York")
                .param("state", "NY")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), eq("New York"), eq("NY"), any(Pageable.class));
    }

    @Test
    void filterProperties_WithCityOnly_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), eq("New York"), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("city", "New York")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), eq("New York"), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithStateOnly_ReturnsFilteredResults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), isNull(), eq("NY"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("state", "NY")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            isNull(), isNull(), eq("NY"), any(Pageable.class));
    }

    @Test
    void filterProperties_WithAge_PassesCorrectParameter() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            eq(10), isNull(), isNull(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("age", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            isNull(), isNull(), isNull(), isNull(), 
            eq(10), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithPageParameter_UsesCorrectPage() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("page", "3")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            any(), any(), any(), any(), any(), any(), any(), 
            eq(PageRequest.of(3, 8)));
    }

    @Test
    void filterProperties_WithCustomPageSize_UsesCorrectSize() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("page", "1")
                .param("size", "20")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            any(), any(), any(), any(), any(), any(), any(), 
            eq(PageRequest.of(1, 20)));
    }

    @Test
    void filterProperties_WithDefaultPagination_UsesDefaults() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("bedrooms", "3")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            any(), any(), any(), any(), any(), any(), any(), 
            eq(PageRequest.of(0, 8)));
    }

    @Test
    void filterProperties_WithEmptyResults_ReturnsEmptyPage() throws Exception {
        // Arrange
        Page<CompactPropertyListingResponse> emptyPage = Page.empty();
        when(propertyService.filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(emptyPage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("bedrooms", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.empty").value(true));

        verify(propertyService, times(1)).filterProperties(
            any(), any(), any(), any(), any(), any(), any(), any(Pageable.class));
    }

    @Test
    void filterProperties_WithCombinedFilters_PassesAllParameters() throws Exception {
        // Arrange
        when(propertyService.filterProperties(
            eq(3), eq(2), eq(500000.0), eq(1000000.0), 
            eq(10), eq("Boston"), eq("MA"), any(Pageable.class)))
            .thenReturn(responsePage);

        // Act & Assert
        mockMvc.perform(get("/api/properties/filter")
                .param("bedrooms", "3")
                .param("bathrooms", "2")
                .param("minPrice", "500000")
                .param("maxPrice", "1000000")
                .param("age", "10")
                .param("city", "Boston")
                .param("state", "MA")
                .param("page", "0")
                .param("size", "8")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(propertyService, times(1)).filterProperties(
            eq(3), eq(2), eq(500000.0), eq(1000000.0), 
            eq(10), eq("Boston"), eq("MA"), eq(PageRequest.of(0, 8)));
    }
}