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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.service.ViewingRequestService;

@ExtendWith(MockitoExtension.class)
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

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        propertyId = UUID.randomUUID();

        // Setup mock user
        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");

        // Setup mock DTO
        mockDTO = new ViewingRequestDTO();
        mockDTO.setPropertyId(propertyId);
        mockDTO.setName("John Doe");
        mockDTO.setEmail("john@example.com");
        mockDTO.setPhone("1234567890");
        mockDTO.setPreferredDate(LocalDate.now().plusDays(7));
        mockDTO.setStartTime(LocalTime.of(10, 0));
        mockDTO.setEndTime(LocalTime.of(11, 0));
        mockDTO.setMessage("Looking forward to viewing this property");

        // Setup mock viewing request
        mockViewingRequest = new ViewingRequest();
        mockViewingRequest.setId(UUID.randomUUID());
        mockViewingRequest.setPropertyId(propertyId);
        mockViewingRequest.setUser(mockUser);
        mockViewingRequest.setName(mockDTO.getName());
        mockViewingRequest.setEmail(mockDTO.getEmail());
        mockViewingRequest.setPhone(mockDTO.getPhone());
        mockViewingRequest.setSubmittedAt(LocalDate.now());
        mockViewingRequest.setPreferredDate(mockDTO.getPreferredDate());
        mockViewingRequest.setStartTime(mockDTO.getStartTime());
        mockViewingRequest.setEndTime(mockDTO.getEndTime());
        mockViewingRequest.setMessage(mockDTO.getMessage());
    }

    @Test
    void createViewingRequest_Success() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.createViewingRequest(eq(userId), any(ViewingRequestDTO.class)))
            .thenReturn(mockViewingRequest);

        // Act
        ResponseEntity<ViewingRequest> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(mockViewingRequest.getId(), response.getBody().getId());
        assertEquals(mockViewingRequest.getPropertyId(), response.getBody().getPropertyId());
        assertEquals(mockViewingRequest.getName(), response.getBody().getName());

        verify(authentication, times(1)).isAuthenticated();
        verify(authentication, times(1)).getPrincipal();
        verify(viewingRequestService, times(1)).createViewingRequest(eq(userId), any(ViewingRequestDTO.class));
    }

    @Test
    void createViewingRequest_NullAuthentication_Returns401() {
        // Act
        ResponseEntity<ViewingRequest> response = viewingRequestController.createViewingRequest(mockDTO, null);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, never()).createViewingRequest(any(UUID.class), any(ViewingRequestDTO.class));
    }

    @Test
    void createViewingRequest_NotAuthenticated_Returns401() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(false);

        // Act
        ResponseEntity<ViewingRequest> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

        verify(authentication, times(1)).isAuthenticated();
        verify(authentication, never()).getPrincipal();
        verify(viewingRequestService, never()).createViewingRequest(any(UUID.class), any(ViewingRequestDTO.class));
    }

    @Test
    void createViewingRequest_InvalidUUID_Returns400() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("invalid-uuid");

        // Act
        ResponseEntity<ViewingRequest> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, never()).createViewingRequest(any(UUID.class), any(ViewingRequestDTO.class));
    }

    @Test
    void createViewingRequest_ServiceThrowsException_Returns400() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.createViewingRequest(eq(userId), any(ViewingRequestDTO.class)))
            .thenThrow(new RuntimeException("User not found"));

        // Act
        ResponseEntity<ViewingRequest> response = viewingRequestController.createViewingRequest(mockDTO, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, times(1)).createViewingRequest(eq(userId), any(ViewingRequestDTO.class));
    }

    @Test
    void getUserViewingRequests_Success() {
        // Arrange
        ViewingRequest request1 = new ViewingRequest();
        request1.setId(UUID.randomUUID());
        request1.setUser(mockUser);
        request1.setPropertyId(propertyId);

        ViewingRequest request2 = new ViewingRequest();
        request2.setId(UUID.randomUUID());
        request2.setUser(mockUser);
        request2.setPropertyId(UUID.randomUUID());

        List<ViewingRequest> mockRequests = Arrays.asList(request1, request2);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.getUserViewingRequests(userId)).thenReturn(mockRequests);

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(mockRequests, response.getBody());

        verify(authentication, times(1)).isAuthenticated();
        verify(authentication, times(1)).getPrincipal();
        verify(viewingRequestService, times(1)).getUserViewingRequests(userId);
    }

    @Test
    void getUserViewingRequests_NullAuthentication_Returns401() {
        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(null);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, never()).getUserViewingRequests(any(UUID.class));
    }

    @Test
    void getUserViewingRequests_NotAuthenticated_Returns401() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(false);

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());

        verify(authentication, times(1)).isAuthenticated();
        verify(authentication, never()).getPrincipal();
        verify(viewingRequestService, never()).getUserViewingRequests(any(UUID.class));
    }

    @Test
    void getUserViewingRequests_InvalidUUID_Returns400() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("invalid-uuid");

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, never()).getUserViewingRequests(any(UUID.class));
    }

    @Test
    void getUserViewingRequests_EmptyList_ReturnsEmptyList() {
        // Arrange
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(userId.toString());
        when(viewingRequestService.getUserViewingRequests(userId)).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getUserViewingRequests(authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());

        verify(viewingRequestService, times(1)).getUserViewingRequests(userId);
    }

    @Test
    void getPropertyViewingRequests_Success() {
        // Arrange
        User user1 = new User();
        user1.setId(UUID.randomUUID());
        
        User user2 = new User();
        user2.setId(UUID.randomUUID());

        ViewingRequest request1 = new ViewingRequest();
        request1.setId(UUID.randomUUID());
        request1.setUser(user1);
        request1.setPropertyId(propertyId);

        ViewingRequest request2 = new ViewingRequest();
        request2.setId(UUID.randomUUID());
        request2.setUser(user2);
        request2.setPropertyId(propertyId);

        List<ViewingRequest> mockRequests = Arrays.asList(request1, request2);
        when(viewingRequestService.getPropertyViewingRequests(propertyId)).thenReturn(mockRequests);

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getPropertyViewingRequests(propertyId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(mockRequests, response.getBody());

        verify(viewingRequestService, times(1)).getPropertyViewingRequests(propertyId);
    }

    @Test
    void getPropertyViewingRequests_EmptyList_ReturnsEmptyList() {
        // Arrange
        when(viewingRequestService.getPropertyViewingRequests(propertyId)).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getPropertyViewingRequests(propertyId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());

        verify(viewingRequestService, times(1)).getPropertyViewingRequests(propertyId);
    }

    @Test
    void getPropertyViewingRequests_ServiceThrowsException_Returns400() {
        // Arrange
        when(viewingRequestService.getPropertyViewingRequests(propertyId))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<List<ViewingRequest>> response = viewingRequestController.getPropertyViewingRequests(propertyId);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(viewingRequestService, times(1)).getPropertyViewingRequests(propertyId);
    }
}
