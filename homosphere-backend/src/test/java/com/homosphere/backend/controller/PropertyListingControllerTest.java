package com.homosphere.backend.controller;

import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.service.PropertyListingService;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@WebMvcTest(
    controllers = PropertyListingController.class,
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.JwtAuthenticationFilter.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CorsConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.ApplicationConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareR2Config.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = com.homosphere.backend.config.CloudflareProperties.class)
    }
)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class PropertyListingControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PropertyListingService propertyListingService;

    // Removed: testGetAllListings_ReturnsOk (no such endpoint in controller)

    @Test
    @WithMockUser
    void submitPropertyListing_ReturnsCreated() throws Exception {
        when(propertyListingService.submitPropertyListing(any())).thenReturn(new PropertyListingResponse());
        mockMvc.perform(post("/api/property-listing/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isCreated());
    }

    // ...

    @Test
    @WithMockUser
    void editPropertyListing_ReturnsOk() throws Exception {
        Mockito.lenient().when(propertyListingService.editPropertyListing(any())).thenReturn(new PropertyListingResponse());
        mockMvc.perform(put("/api/property-listing/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void deletePropertyListing_ReturnsNoContent() throws Exception {
        Mockito.doNothing().when(propertyListingService).deletePropertyListing(any());
        mockMvc.perform(delete("/api/property-listing/delete/" + UUID.randomUUID()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void getPropertyListingById_ReturnsOk() throws Exception {
        Mockito.lenient().when(propertyListingService.getPropertyListingById(any())).thenReturn(new PropertyListingResponse());
        mockMvc.perform(get("/api/property-listing/" + UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getPublicPropertyListingById_ReturnsOk() throws Exception {
        Mockito.lenient().when(propertyListingService.getPropertyListingPublicById(any())).thenReturn(new PropertyListingPublicResponse());
        mockMvc.perform(get("/api/property-listing/public/" + UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getPropertyListingStore_ReturnsOk() throws Exception {
        when(propertyListingService.getAllPublishedPropertyListings()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/property-listing/store"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getUserPropertyListingTabs_ReturnsOk() throws Exception {
        when(propertyListingService.getUserPropertyListingStatuses(any())).thenReturn(List.of(PropertyListingStatus.PENDING));
        mockMvc.perform(get("/api/property-listing/status/" + UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getUserPropertyListings_ReturnsOk() throws Exception {
        when(propertyListingService.getUserPropertyListings(any())).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/property-listing/user/" + UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void toggleSaveProperty_ReturnsOk() throws Exception {
        UUID propertyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        
        Mockito.doNothing().when(propertyListingService).toggleSaveProperty(propertyId, userId);

        mockMvc.perform(post("/api/property-listing/public/user/" + propertyId + "/save/" + userId))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"message\": \"Property save state updated\"}"));
    }

    @Test
    @WithMockUser
    void toggleSaveProperty_ReturnsBadRequest_OnException() throws Exception {
        UUID propertyId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        
        Mockito.doThrow(new RuntimeException("User not found"))
               .when(propertyListingService).toggleSaveProperty(propertyId, userId);

        mockMvc.perform(post("/api/property-listing/public/user/" + propertyId + "/save/" + userId))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: User not found"));
    }

    @Test
    @WithMockUser
    void getSavedPropertyIds_ReturnsOk() throws Exception {
        UUID userId = UUID.randomUUID();
        List<UUID> savedIds = List.of(UUID.randomUUID(), UUID.randomUUID());
        
        when(propertyListingService.getUserSavedPropertyIds(userId)).thenReturn(savedIds);

        mockMvc.perform(get("/api/property-listing/public/user/saved-ids/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser
    void getSavedPropertyIds_ReturnsEmptyList_OnException() throws Exception {
        UUID userId = UUID.randomUUID();
        
        // Simulating an exception in service
        when(propertyListingService.getUserSavedPropertyIds(userId))
            .thenThrow(new RuntimeException("Database error"));

        // Controller catches exception and returns empty list
        mockMvc.perform(get("/api/property-listing/public/user/saved-ids/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
