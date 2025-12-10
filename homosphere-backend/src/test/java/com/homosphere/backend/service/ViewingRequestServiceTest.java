package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.ViewingRequestRepository;

@ExtendWith(MockitoExtension.class)
class ViewingRequestServiceTest {

    @Mock
    private ViewingRequestRepository viewingRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ViewingRequestService viewingRequestService;

    private UUID userId;
    private UUID propertyId;
    private User mockUser;
    private ViewingRequestDTO mockDTO;
    private ViewingRequest mockViewingRequest;

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
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenReturn(mockViewingRequest);

        // Act
        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        // Assert
        assertNotNull(result);
        assertEquals(propertyId, result.getPropertyId());
        assertEquals(mockUser, result.getUser());
        assertEquals(mockDTO.getName(), result.getName());
        assertEquals(mockDTO.getEmail(), result.getEmail());
        assertEquals(mockDTO.getPhone(), result.getPhone());
        assertEquals(mockDTO.getPreferredDate(), result.getPreferredDate());
        assertEquals(mockDTO.getStartTime(), result.getStartTime());
        assertEquals(mockDTO.getEndTime(), result.getEndTime());
        assertEquals(mockDTO.getMessage(), result.getMessage());
        assertNotNull(result.getSubmittedAt());

        verify(userRepository, times(1)).findById(userId);
        verify(viewingRequestRepository, times(1)).save(any(ViewingRequest.class));
    }

    @Test
    void createViewingRequest_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            viewingRequestService.createViewingRequest(userId, mockDTO);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(userId);
        verify(viewingRequestRepository, never()).save(any(ViewingRequest.class));
    }

    @Test
    void createViewingRequest_SetsSubmittedAtToCurrentDate() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenAnswer(invocation -> {
            ViewingRequest vr = invocation.getArgument(0);
            vr.setId(UUID.randomUUID());
            return vr;
        });

        // Act
        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        // Assert
        assertNotNull(result.getSubmittedAt());
        assertEquals(LocalDate.now(), result.getSubmittedAt());
    }

    @Test
    void createViewingRequest_WithNullMessage_Success() {
        // Arrange
        mockDTO.setMessage(null);
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenReturn(mockViewingRequest);

        // Act
        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        // Assert
        assertNotNull(result);
        verify(viewingRequestRepository, times(1)).save(any(ViewingRequest.class));
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
        when(viewingRequestRepository.findByUser_Id(userId)).thenReturn(mockRequests);

        // Act
        List<ViewingRequest> result = viewingRequestService.getUserViewingRequests(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(mockRequests, result);
        verify(viewingRequestRepository, times(1)).findByUser_Id(userId);
    }

    @Test
    void getUserViewingRequests_NoRequests_ReturnsEmptyList() {
        // Arrange
        when(viewingRequestRepository.findByUser_Id(userId)).thenReturn(Arrays.asList());

        // Act
        List<ViewingRequest> result = viewingRequestService.getUserViewingRequests(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(viewingRequestRepository, times(1)).findByUser_Id(userId);
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
        when(viewingRequestRepository.findByPropertyId(propertyId)).thenReturn(mockRequests);

        // Act
        List<ViewingRequest> result = viewingRequestService.getPropertyViewingRequests(propertyId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(mockRequests, result);
        verify(viewingRequestRepository, times(1)).findByPropertyId(propertyId);
    }

    @Test
    void getPropertyViewingRequests_NoRequests_ReturnsEmptyList() {
        // Arrange
        when(viewingRequestRepository.findByPropertyId(propertyId)).thenReturn(Arrays.asList());

        // Act
        List<ViewingRequest> result = viewingRequestService.getPropertyViewingRequests(propertyId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(viewingRequestRepository, times(1)).findByPropertyId(propertyId);
    }

    @Test
    void createViewingRequest_ValidatesAllFields() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenAnswer(invocation -> {
            ViewingRequest savedRequest = invocation.getArgument(0);
            
            // Verify all fields are properly set
            assertNotNull(savedRequest.getPropertyId());
            assertNotNull(savedRequest.getUser());
            assertNotNull(savedRequest.getName());
            assertNotNull(savedRequest.getEmail());
            assertNotNull(savedRequest.getPhone());
            assertNotNull(savedRequest.getSubmittedAt());
            assertNotNull(savedRequest.getPreferredDate());
            assertNotNull(savedRequest.getStartTime());
            assertNotNull(savedRequest.getEndTime());
            
            savedRequest.setId(UUID.randomUUID());
            return savedRequest;
        });

        // Act
        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        // Assert
        assertNotNull(result);
        verify(viewingRequestRepository, times(1)).save(any(ViewingRequest.class));
    }
}
