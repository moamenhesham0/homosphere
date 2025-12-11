package com.homosphere.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.PropertyListingRequest;
import com.homosphere.backend.dto.PropertyListingResponse;
import com.homosphere.backend.service.PropertyListingService;

@ExtendWith(MockitoExtension.class)
class PropertyListingControllerTest {

    @Mock
    private PropertyListingService propertyListingService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PropertyListingController propertyListingController;

    private PropertyListingRequest request;
    private PropertyListingResponse response;
    private CompactPropertyListingResponse compactResponse;
    private UUID propertyListingId;

    @BeforeEach
    void setUp() {
        propertyListingId = UUID.randomUUID();
        
        request = new PropertyListingRequest();
        request.setTitle("Test Property");
        request.setDescription("Test Description");

        response = new PropertyListingResponse();
        response.setPropertyListingId(propertyListingId);
        response.setTitle("Test Property");

        compactResponse = new CompactPropertyListingResponse();
        compactResponse.setPropertyListingId(propertyListingId);
        compactResponse.setTitle("Test Property");
        compactResponse.setPrice(500000.0);
        compactResponse.setCity("Test City");
        compactResponse.setState("Test State");
    }

    @Test
    void createPropertyListing_WithValidRequest_ReturnsCreated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.createPropertyListing(any(PropertyListingRequest.class)))
            .thenReturn(response);

        ResponseEntity<?> result = propertyListingController.createPropertyListing(request, authentication);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof PropertyListingResponse);
        verify(propertyListingService, times(1)).createPropertyListing(request);
    }

    @Test
    void createPropertyListing_WithUnauthenticated_ReturnsUnauthorized() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> result = propertyListingController.createPropertyListing(request, authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        verify(propertyListingService, never()).createPropertyListing(any());
    }

    @Test
    void createPropertyListing_WithNullAuthentication_ReturnsUnauthorized() {
        ResponseEntity<?> result = propertyListingController.createPropertyListing(request, null);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        verify(propertyListingService, never()).createPropertyListing(any());
    }

    @Test
    void createPropertyListing_WithIllegalArgument_ReturnsBadRequest() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.createPropertyListing(any(PropertyListingRequest.class)))
            .thenThrow(new IllegalArgumentException("Invalid request"));

        ResponseEntity<?> result = propertyListingController.createPropertyListing(request, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) result.getBody();
        assertEquals("Invalid request", body.get("message"));
    }

    @Test
    void createPropertyListing_WithException_ReturnsInternalServerError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.createPropertyListing(any(PropertyListingRequest.class)))
            .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> result = propertyListingController.createPropertyListing(request, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) result.getBody();
        assertTrue(body.get("message").toString().contains("Failed to create property listing"));
    }

    @Test
    void getAllPropertyListings_ReturnsListOfProperties() {
        List<CompactPropertyListingResponse> listings = Arrays.asList(compactResponse);
        when(propertyListingService.getAllPropertyListings()).thenReturn(listings);

        ResponseEntity<?> result = propertyListingController.getAllPropertyListings();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof List);
        verify(propertyListingService, times(1)).getAllPropertyListings();
    }

    @Test
    void getAllPropertyListings_WithException_ReturnsInternalServerError() {
        when(propertyListingService.getAllPropertyListings())
            .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> result = propertyListingController.getAllPropertyListings();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) result.getBody();
        assertTrue(body.get("message").toString().contains("Failed to fetch property listings"));
    }

    @Test
    void getPropertyListingById_WithValidId_ReturnsProperty() {
        when(propertyListingService.getPropertyListingById(propertyListingId)).thenReturn(response);

        ResponseEntity<?> result = propertyListingController.getPropertyListingById(propertyListingId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof PropertyListingResponse);
        verify(propertyListingService, times(1)).getPropertyListingById(propertyListingId);
    }

    @Test
    void getPropertyListingById_WithInvalidId_ReturnsNotFound() {
        when(propertyListingService.getPropertyListingById(propertyListingId))
            .thenThrow(new IllegalArgumentException("Property not found"));

        ResponseEntity<?> result = propertyListingController.getPropertyListingById(propertyListingId);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) result.getBody();
        assertEquals("Property not found", body.get("message"));
    }

    @Test
    void getPropertyListingById_WithException_ReturnsInternalServerError() {
        when(propertyListingService.getPropertyListingById(propertyListingId))
            .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> result = propertyListingController.getPropertyListingById(propertyListingId);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
    }

    @Test
    void updatePropertyListing_WithValidRequest_ReturnsUpdatedProperty() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.updatePropertyListing(eq(propertyListingId), any(PropertyListingRequest.class)))
            .thenReturn(response);

        ResponseEntity<?> result = propertyListingController.updatePropertyListing(propertyListingId, request, authentication);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        verify(propertyListingService, times(1)).updatePropertyListing(propertyListingId, request);
    }

    @Test
    void updatePropertyListing_WithUnauthenticated_ReturnsUnauthorized() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> result = propertyListingController.updatePropertyListing(propertyListingId, request, authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        verify(propertyListingService, never()).updatePropertyListing(any(), any());
    }

    @Test
    void updatePropertyListing_WithInvalidId_ReturnsNotFound() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.updatePropertyListing(eq(propertyListingId), any(PropertyListingRequest.class)))
            .thenThrow(new IllegalArgumentException("Property not found"));

        ResponseEntity<?> result = propertyListingController.updatePropertyListing(propertyListingId, request, authentication);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }

    @Test
    void updatePropertyListing_WithException_ReturnsInternalServerError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(propertyListingService.updatePropertyListing(eq(propertyListingId), any(PropertyListingRequest.class)))
            .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> result = propertyListingController.updatePropertyListing(propertyListingId, request, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
    }

    @Test
    void deletePropertyListing_WithValidId_ReturnsOk() {
        when(authentication.isAuthenticated()).thenReturn(true);
        doNothing().when(propertyListingService).deletePropertyListing(propertyListingId);

        ResponseEntity<?> result = propertyListingController.deletePropertyListing(propertyListingId, authentication);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) result.getBody();
        assertEquals("Property listing deleted successfully", body.get("message"));
        verify(propertyListingService, times(1)).deletePropertyListing(propertyListingId);
    }

    @Test
    void deletePropertyListing_WithUnauthenticated_ReturnsUnauthorized() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> result = propertyListingController.deletePropertyListing(propertyListingId, authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        verify(propertyListingService, never()).deletePropertyListing(any());
    }

    @Test
    void deletePropertyListing_WithInvalidId_ReturnsNotFound() {
        when(authentication.isAuthenticated()).thenReturn(true);
        doThrow(new IllegalArgumentException("Property not found"))
            .when(propertyListingService).deletePropertyListing(propertyListingId);

        ResponseEntity<?> result = propertyListingController.deletePropertyListing(propertyListingId, authentication);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
    }

    @Test
    void deletePropertyListing_WithException_ReturnsInternalServerError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        doThrow(new RuntimeException("Database error"))
            .when(propertyListingService).deletePropertyListing(propertyListingId);

        ResponseEntity<?> result = propertyListingController.deletePropertyListing(propertyListingId, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
    }
}
