package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.homosphere.backend.dto.StatusUpdateDTO;
import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.ProcessedViewingRequest;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.repository.ProcessedViewingRequestRepository;
import com.homosphere.backend.repository.PropertyRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.repository.ViewingRequestRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ViewingRequestServiceTest {

    @Mock
    private ViewingRequestRepository viewingRequestRepository;

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PropertyRepository propertyRepository;
    
    @Mock
    private ProcessedViewingRequestRepository processedViewingRequestRepository;

    @InjectMocks
    private ViewingRequestService viewingRequestService;

    private UUID userId;
    private UUID propertyId;
    private User mockUser;
    private Property mockProperty;
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
        mockUser.setRole("BUYER");
        
        // Setup mock property
        mockProperty = new Property();
        mockProperty.setPropertyId(propertyId);

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
        mockViewingRequest.setProperty(mockProperty);
        mockViewingRequest.setUser(mockUser);
        mockViewingRequest.setName(mockDTO.getName());
        mockViewingRequest.setEmail(mockDTO.getEmail());
        mockViewingRequest.setPhone(mockDTO.getPhone());
        mockViewingRequest.setSubmittedAt(LocalDate.now());
        mockViewingRequest.setPreferredDate(mockDTO.getPreferredDate());
        mockViewingRequest.setStartTime(mockDTO.getStartTime());
        mockViewingRequest.setEndTime(mockDTO.getEndTime());
        mockViewingRequest.setMessage(mockDTO.getMessage());
        mockViewingRequest.setStatus(ViewingRequest.Status.PENDING);
    }

    // --- Create Viewing Request Tests ---

    @Test
    void createViewingRequest_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(mockProperty));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenReturn(mockViewingRequest);

        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        assertNotNull(result);
        assertEquals(mockProperty, result.getProperty());
        assertEquals(mockUser, result.getUser());
        verify(userRepository, times(1)).findById(userId);
        verify(viewingRequestRepository, times(1)).save(any(ViewingRequest.class));
    }

    @Test
    void createViewingRequest_UserNotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            viewingRequestService.createViewingRequest(userId, mockDTO);
        });

        assertEquals("User not found", exception.getMessage());
        verify(viewingRequestRepository, never()).save(any(ViewingRequest.class));
    }
    
    @Test
    void createViewingRequest_NonBuyer_ThrowsException() {
        mockUser.setRole("AGENT"); // Set role to something other than BUYER
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            viewingRequestService.createViewingRequest(userId, mockDTO);
        });

        assertTrue(exception.getMessage().contains("Only buyers can submit viewing requests"));
        verify(viewingRequestRepository, never()).save(any(ViewingRequest.class));
    }

    @Test
    void createViewingRequest_SetsSubmittedAtToCurrentDate() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(mockProperty));
        
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenAnswer(invocation -> {
            ViewingRequest vr = invocation.getArgument(0);
            vr.setId(UUID.randomUUID());
            return vr;
        });

        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        assertNotNull(result.getSubmittedAt());
        assertEquals(LocalDate.now(), result.getSubmittedAt());
    }

    @Test
    void createViewingRequest_WithNullMessage_Success() {
        mockDTO.setMessage(null);
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(mockProperty));
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenReturn(mockViewingRequest);

        ViewingRequest result = viewingRequestService.createViewingRequest(userId, mockDTO);

        assertNotNull(result);
        verify(viewingRequestRepository, times(1)).save(any(ViewingRequest.class));
    }

    // --- Update Request Status Tests ---

    @Test
    void updateRequestStatus_Success() {
        UUID requestId = mockViewingRequest.getId();
        StatusUpdateDTO statusDTO = new StatusUpdateDTO();
        statusDTO.setStatus(ViewingRequest.Status.APPROVED);
        statusDTO.setProcessedBy(userId);
        statusDTO.setAgentMessage("Confirmed");

        when(viewingRequestRepository.findById(requestId)).thenReturn(Optional.of(mockViewingRequest));
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser)); // Agent
        when(processedViewingRequestRepository.findAll()).thenReturn(Collections.emptyList());
        when(viewingRequestRepository.save(any(ViewingRequest.class))).thenReturn(mockViewingRequest);

        ViewingRequest result = viewingRequestService.updateRequestStatus(requestId, statusDTO);

        assertEquals(ViewingRequest.Status.APPROVED, result.getStatus());
        verify(processedViewingRequestRepository, times(1)).save(any(ProcessedViewingRequest.class));
        verify(viewingRequestRepository, times(1)).save(mockViewingRequest);
    }

    @Test
    void updateRequestStatus_RequestNotFound_ThrowsException() {
        UUID requestId = UUID.randomUUID();
        StatusUpdateDTO statusDTO = new StatusUpdateDTO();
        
        when(viewingRequestRepository.findById(requestId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            viewingRequestService.updateRequestStatus(requestId, statusDTO);
        });

        assertEquals("Viewing Request not found", exception.getMessage());
        verify(processedViewingRequestRepository, never()).save(any());
    }

    @Test
    void updateRequestStatus_AgentNotFound_ThrowsException() {
        UUID requestId = mockViewingRequest.getId();
        StatusUpdateDTO statusDTO = new StatusUpdateDTO();
        statusDTO.setStatus(ViewingRequest.Status.REJECTED);
        statusDTO.setProcessedBy(userId);

        when(viewingRequestRepository.findById(requestId)).thenReturn(Optional.of(mockViewingRequest));
        when(processedViewingRequestRepository.findAll()).thenReturn(Collections.emptyList());
        when(userRepository.findById(userId)).thenReturn(Optional.empty()); // Agent not found

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            viewingRequestService.updateRequestStatus(requestId, statusDTO);
        });

        assertTrue(exception.getMessage().contains("Agent user not found"));
        verify(processedViewingRequestRepository, never()).save(any());
    }

    // --- Getters Tests ---

    @Test
    void getUserViewingRequests_Success() {
        List<ViewingRequest> mockRequests = Arrays.asList(mockViewingRequest);
        when(viewingRequestRepository.findByUser_Id(userId)).thenReturn(mockRequests);

        List<ViewingRequest> result = viewingRequestService.getUserViewingRequests(userId);

        assertEquals(1, result.size());
        assertEquals(mockRequests, result);
    }

    @Test
    void getUserViewingRequests_NoRequests_ReturnsEmptyList() {
        when(viewingRequestRepository.findByUser_Id(userId)).thenReturn(Collections.emptyList());

        List<ViewingRequest> result = viewingRequestService.getUserViewingRequests(userId);

        assertTrue(result.isEmpty());
    }

    @Test
    void getPropertyViewingRequests_Success() {
        List<ViewingRequest> mockRequests = Arrays.asList(mockViewingRequest);
        when(viewingRequestRepository.findByProperty_PropertyId(propertyId)).thenReturn(mockRequests);

        List<ViewingRequest> result = viewingRequestService.getPropertyViewingRequests(propertyId);

        assertEquals(1, result.size());
    }

    @Test
    void getPropertyViewingRequests_NoRequests_ReturnsEmptyList() {
        when(viewingRequestRepository.findByProperty_PropertyId(propertyId)).thenReturn(Collections.emptyList());

        List<ViewingRequest> result = viewingRequestService.getPropertyViewingRequests(propertyId);

        assertTrue(result.isEmpty());
    }
    
    @Test
    void getViewingRequestsForSellerProperties_Success() {
        List<ViewingRequest> mockRequests = Arrays.asList(mockViewingRequest);
        when(viewingRequestRepository.findByPropertyListingSellerId(userId)).thenReturn(mockRequests);

        List<ViewingRequest> result = viewingRequestService.getViewingRequestsForSellerProperties(userId);

        assertEquals(1, result.size());
        assertEquals(mockRequests, result);
        verify(viewingRequestRepository, times(1)).findByPropertyListingSellerId(userId);
    }
}