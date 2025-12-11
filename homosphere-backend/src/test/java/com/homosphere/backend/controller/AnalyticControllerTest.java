package com.homosphere.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homosphere.backend.dto.PropertyStatsDTO;
import com.homosphere.backend.dto.UserSubscriptionAnalyticsDTO;
import com.homosphere.backend.service.AnalyticsService;

class AnalyticControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private analyticController analyticController;

    private ObjectMapper objectMapper;
    private UUID testUserId;
    private UUID testPropertyId;
    private Authentication authentication;
    private UserSubscriptionAnalyticsDTO testSubscriptionDTO;
    private PropertyStatsDTO testPropertyStatsDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(analyticController).build();
        objectMapper = new ObjectMapper();
        
        testUserId = UUID.randomUUID();
        testPropertyId = UUID.randomUUID();
        
        // Create mock authentication
        authentication = new UsernamePasswordAuthenticationToken(
            testUserId.toString(),
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_SELLER"))
        );
        
        // Create test subscription DTO
        testSubscriptionDTO = new UserSubscriptionAnalyticsDTO();
        testSubscriptionDTO.setTier("Pro");
        testSubscriptionDTO.setStatus("ACTIVE");
        testSubscriptionDTO.setStartDate("2024-11-01");
        testSubscriptionDTO.setEndDate("2025-01-01");
        testSubscriptionDTO.setNextPaymentDate("2025-01-01");
        testSubscriptionDTO.setPaymentAmount(29);
        testSubscriptionDTO.setPaymentFrequency("Monthly");
        testSubscriptionDTO.setPropertiesListed(15);
        testSubscriptionDTO.setPropertiesLimit(25);
        testSubscriptionDTO.setViews(500);
        testSubscriptionDTO.setLeadsGenerated(25);
        testSubscriptionDTO.setDaysRemaining(30);
        
        // Create test property stats DTO
        testPropertyStatsDTO = new PropertyStatsDTO(150, 10, 50);
    }

    @Test
    void testGetPropertyStats_Success() throws Exception {
        // Arrange
        when(analyticsService.getPropertyStats(testPropertyId, testUserId))
            .thenReturn(testPropertyStatsDTO);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", testPropertyId)
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.impressions").value(150))
            .andExpect(jsonPath("$.leads").value(10))
            .andExpect(jsonPath("$.clicks").value(50));
        
        verify(analyticsService).getPropertyStats(testPropertyId, testUserId);
    }

    @Test
    void testGetPropertyStats_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", testPropertyId))
            .andExpect(status().isUnauthorized());
        
        verify(analyticsService, never()).getPropertyStats(any(), any());
    }

    @Test
    void testGetPropertyStats_NotFound() throws Exception {
        // Arrange
        when(analyticsService.getPropertyStats(testPropertyId, testUserId))
            .thenReturn(null);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", testPropertyId)
                .principal(authentication))
            .andExpect(status().isNotFound());
        
        verify(analyticsService).getPropertyStats(testPropertyId, testUserId);
    }

    @Test
    void testGetPropertyStats_InvalidUUID() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", "invalid-uuid")
                .principal(authentication))
            .andExpect(status().isBadRequest());
        
        verify(analyticsService, never()).getPropertyStats(any(), any());
    }

    @Test
    void testGetUserProperties_Success() throws Exception {
        // Arrange
        List<Map<String, Object>> properties = Arrays.asList(
            Map.of("id", UUID.randomUUID(), "title", "Property 1"),
            Map.of("id", UUID.randomUUID(), "title", "Property 2")
        );
        when(analyticsService.getUserProperties(testUserId)).thenReturn(properties);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/properties/user")
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].title").value("Property 1"))
            .andExpect(jsonPath("$[1].title").value("Property 2"));
        
        verify(analyticsService).getUserProperties(testUserId);
    }

    @Test
    void testGetUserProperties_EmptyList() throws Exception {
        // Arrange
        when(analyticsService.getUserProperties(testUserId)).thenReturn(Collections.emptyList());
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/properties/user")
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
        
        verify(analyticsService).getUserProperties(testUserId);
    }

    @Test
    void testGetUserProperties_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/analytics/properties/user"))
            .andExpect(status().isUnauthorized());
        
        verify(analyticsService, never()).getUserProperties(any());
    }

    @Test
    void testGetUserSubscriptionAnalytics_Success() throws Exception {
        // Arrange
        when(analyticsService.getUserSubscriptionDetails(testUserId))
            .thenReturn(testSubscriptionDTO);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/subscriptions/user")
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.tier").value("Pro"))
            .andExpect(jsonPath("$.status").value("ACTIVE"))
            .andExpect(jsonPath("$.startDate").value("2024-11-01"))
            .andExpect(jsonPath("$.endDate").value("2025-01-01"))
            .andExpect(jsonPath("$.nextPaymentDate").value("2025-01-01"))
            .andExpect(jsonPath("$.paymentAmount").value(29))
            .andExpect(jsonPath("$.paymentFrequency").value("Monthly"))
            .andExpect(jsonPath("$.propertiesListed").value(15))
            .andExpect(jsonPath("$.propertiesLimit").value(25))
            .andExpect(jsonPath("$.views").value(500))
            .andExpect(jsonPath("$.leadsGenerated").value(25))
            .andExpect(jsonPath("$.daysRemaining").value(30));
        
        verify(analyticsService).getUserSubscriptionDetails(testUserId);
    }

    @Test
    void testGetUserSubscriptionAnalytics_NotFound() throws Exception {
        // Arrange
        when(analyticsService.getUserSubscriptionDetails(testUserId))
            .thenReturn(null);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/subscriptions/user")
                .principal(authentication))
            .andExpect(status().isNotFound());
        
        verify(analyticsService).getUserSubscriptionDetails(testUserId);
    }

    @Test
    void testGetUserSubscriptionAnalytics_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/analytics/subscriptions/user"))
            .andExpect(status().isUnauthorized());
        
        verify(analyticsService, never()).getUserSubscriptionDetails(any());
    }

    @Test
    void testGetPropertyStats_DifferentUserCannotAccessProperty() throws Exception {
        // Arrange - Service returns null for unauthorized access
        when(analyticsService.getPropertyStats(testPropertyId, testUserId))
            .thenReturn(null);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", testPropertyId)
                .principal(authentication))
            .andExpect(status().isNotFound());
        
        verify(analyticsService).getPropertyStats(testPropertyId, testUserId);
    }

    @Test
    void testGetUserSubscriptionAnalytics_NullAuthentication() throws Exception {
        // Act & Assert - Don't set principal to test null authentication
        mockMvc.perform(get("/api/analytics/subscriptions/user"))
            .andExpect(status().isUnauthorized());
        
        verify(analyticsService, never()).getUserSubscriptionDetails(any());
    }

    @Test
    void testGetUserProperties_ValidAuthentication() throws Exception {
        // Arrange
        List<Map<String, Object>> properties = Collections.singletonList(
            Map.of("id", testPropertyId, "title", "Test Property")
        );
        when(analyticsService.getUserProperties(testUserId)).thenReturn(properties);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/properties/user")
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(testPropertyId.toString()))
            .andExpect(jsonPath("$[0].title").value("Test Property"));
        
        verify(analyticsService).getUserProperties(testUserId);
    }

    @Test
    void testGetPropertyStats_WithZeroStats() throws Exception {
        // Arrange
        PropertyStatsDTO zeroStatsDTO = new PropertyStatsDTO(0, 0, 0);
        when(analyticsService.getPropertyStats(testPropertyId, testUserId))
            .thenReturn(zeroStatsDTO);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/property/{id}", testPropertyId)
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.impressions").value(0))
            .andExpect(jsonPath("$.leads").value(0))
            .andExpect(jsonPath("$.clicks").value(0));
        
        verify(analyticsService).getPropertyStats(testPropertyId, testUserId);
    }

    @Test
    void testGetUserSubscriptionAnalytics_WithCanceledStatus() throws Exception {
        // Arrange
        testSubscriptionDTO.setStatus("CANCELED");
        testSubscriptionDTO.setNextPaymentDate(null);
        when(analyticsService.getUserSubscriptionDetails(testUserId))
            .thenReturn(testSubscriptionDTO);
        
        // Act & Assert
        mockMvc.perform(get("/api/analytics/subscriptions/user")
                .principal(authentication))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CANCELED"))
            .andExpect(jsonPath("$.nextPaymentDate").doesNotExist());
        
        verify(analyticsService).getUserSubscriptionDetails(testUserId);
    }
}
