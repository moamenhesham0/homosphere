package com.homosphere.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.homosphere.backend.dto.StatusUpdateDTO;
import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.service.ViewingRequestService;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ViewingRequestControllerTest {

    @Mock
    private ViewingRequestService viewingRequestService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ViewingRequestController viewingRequestController;

    private UUID userId;
    private UUID propertyId;
    private ViewingRequestDTO mockDTO;
    private ViewingRequest mockViewingRequest;
    private User mockUser;
    private Property mockProperty;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        propertyId = UUID.randomUUID();

        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setEmail("test@example.com");

        mockProperty = new Property();
        mockProperty.setPropertyId(propertyId);

        mockDTO = new ViewingRequestDTO();
        mockDTO.setPropertyId(propertyId);
        mockDTO.setName("John Doe");
        mockDTO.setEmail("john@example.com");
        mockDTO.setPhone("1234567890");
        mockDTO.setPreferredDate(LocalDate.now().plusDays(7));
        mockDTO.setStartTime(LocalTime.of(10, 0));
        mockDTO.setEndTime(LocalTime.of(11, 0));
        mockDTO.setMessage("Looking forward to viewing this property");

        mockViewingRequest = new ViewingRequest();
        mockViewingRequest.setId(UUID.randomUUID());
        mockViewingRequest.setProperty(mockProperty);
        mockViewingRequest.setUser(mockUser);
        mockViewingRequest.setName(mockDTO.getName());
    }

    // --- Create Viewing Request Tests ---

    @Test
    void createViewingRequest_Success() {
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.createViewingRequest(eq(userId), any(ViewingRequestDTO.class)))
            .thenReturn(mockViewingRequest);

        ResponseEntity<?> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockViewingRequest, response.getBody());
    }

    @Test
    void createViewingRequest_IllegalArgumentException() {
        // Covers: catch (IllegalArgumentException e)
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.createViewingRequest(any(), any()))
            .thenThrow(new IllegalArgumentException("Invalid date"));

        ResponseEntity<?> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid data"));
    }

    @Test
    void createViewingRequest_GeneralException() {
        // Covers: catch (Exception e)
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.createViewingRequest(any(), any()))
            .thenThrow(new RuntimeException("Database down"));

        ResponseEntity<?> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error"));
    }

    // --- Get User Viewing Requests Tests ---

    @Test
    void getUserViewingRequests_Success() {
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.getUserViewingRequests(userId))
            .thenReturn(Arrays.asList(mockViewingRequest));

        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody().isEmpty());
    }

    @Test
    void getUserViewingRequests_Exception() {
        // Covers: catch (Exception e)
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.getUserViewingRequests(any()))
            .thenThrow(new RuntimeException("Error fetching"));

        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    // --- Get Seller Properties Tests ---

    @Test
    void getSellerPropertyViewingRequests_Success() {
        when(viewingRequestService.getViewingRequestsForSellerProperties(userId))
            .thenReturn(Arrays.asList(mockViewingRequest));

        ResponseEntity<?> response = viewingRequestController.getSellerPropertyViewingRequests(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<ViewingRequest> body = (List<ViewingRequest>) response.getBody();
        assertEquals(1, body.size());
    }

    @Test
    void getSellerPropertyViewingRequests_Exception() {
        // Covers: catch (Exception e)
        when(viewingRequestService.getViewingRequestsForSellerProperties(any()))
            .thenThrow(new RuntimeException("Seller not found"));

        ResponseEntity<?> response = viewingRequestController.getSellerPropertyViewingRequests(userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error"));
    }

    // --- Update Viewing Request Status Tests (NEW) ---

    @Test
    void updateViewingRequestStatus_Success() {
        UUID requestId = UUID.randomUUID();
        StatusUpdateDTO dto = new StatusUpdateDTO();
        dto.setProcessedBy(userId);
        dto.setStatus(ViewingRequest.Status.APPROVED);

        when(viewingRequestService.updateRequestStatus(eq(requestId), any(StatusUpdateDTO.class)))
            .thenReturn(mockViewingRequest);

        ResponseEntity<?> response = viewingRequestController.updateViewingRequestStatus(requestId, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockViewingRequest, response.getBody());
    }

    @Test
    void updateViewingRequestStatus_MissingUserId() {
        UUID requestId = UUID.randomUUID();
        StatusUpdateDTO dto = new StatusUpdateDTO();
        dto.setProcessedBy(null); // Missing ID

        ResponseEntity<?> response = viewingRequestController.updateViewingRequestStatus(requestId, dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error: 'processedBy' User ID is required"));
    }

    @Test
    void updateViewingRequestStatus_Exception() {
        UUID requestId = UUID.randomUUID();
        StatusUpdateDTO dto = new StatusUpdateDTO();
        dto.setProcessedBy(userId);

        when(viewingRequestService.updateRequestStatus(any(), any()))
            .thenThrow(new RuntimeException("Update failed"));

        ResponseEntity<?> response = viewingRequestController.updateViewingRequestStatus(requestId, dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error updating status"));
    }
}