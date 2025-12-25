package com.homosphere.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.mapper.PropertyListingMapper;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertySubmissionReviewRepository;
import com.homosphere.backend.repository.UserRepository;
import com.homosphere.backend.updater.PropertyListingUpdater;
import com.homosphere.backend.model.User;

class PropertyListingServiceTest {
    @Mock
    private PropertyListingRepository propertyListingRepository;
    @Mock
    private PropertyListingMapper propertyListingMapper;
    @Mock
    private PropertyListingUpdater propertyListingUpdater;
    @Mock
    private PropertySubmissionReviewRepository propertySubmissionReviewRepository;
    @Mock
    private PropertySubmissionReviewService propertySubmissionReviewService;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private PropertyListingService propertyListingService;

    private PropertyListing propertyListing;
    private PropertyListingRequest propertyListingRequest;
    private PropertyListingDraftRequest draftRequest;
    private PropertyListingEditRequest editRequest;
    private UUID id;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        id = UUID.randomUUID();
        propertyListing = new PropertyListing();
        propertyListing.setPropertyListingId(id);
        propertyListingRequest = new PropertyListingRequest();
        draftRequest = new PropertyListingDraftRequest();
        draftRequest.setPropertyListingId(id);
        editRequest = new PropertyListingEditRequest();
        editRequest.setPropertyListingId(id);
        user = new User();
        user.setId(UUID.randomUUID());
    }

    @Test
    void submitPropertyListing_Success() {
        when(propertyListingUpdater.createWithRelationLinks(any())).thenReturn(propertyListing);
        when(propertyListingRepository.save(any())).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any())).thenReturn(new PropertyListingResponse());
        PropertyListingResponse result = propertyListingService.submitPropertyListing(propertyListingRequest);
        assertNotNull(result);
    }

    @Test
    void submitPropertyListing_ThrowsException() {
        when(propertyListingUpdater.createWithRelationLinks(any())).thenThrow(new RuntimeException("fail"));
        assertThrows(RuntimeException.class, () -> propertyListingService.submitPropertyListing(propertyListingRequest));
    }

    @Test
    void saveDraftPropertyListing_Success() {
        when(propertyListingUpdater.createWithRelationLinks(any())).thenReturn(propertyListing);
        when(propertyListingRepository.save(any())).thenReturn(propertyListing);
        when(propertyListingMapper.toResponse(any())).thenReturn(new PropertyListingResponse());
        PropertyListingResponse result = propertyListingService.saveDraftPropertyListing(propertyListingRequest);
        assertNotNull(result);
    }

    @Test
    void resubmitPropertyListing_Success() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertyListingUpdater).applyDraft(any(), any());
        when(propertyListingMapper.toResponse(any())).thenReturn(new PropertyListingResponse());
        PropertyListingResponse result = propertyListingService.resubmitPropertyListing(draftRequest);
        assertNotNull(result);
    }

    @Test
    void resubmitPropertyListing_NotFound() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> propertyListingService.resubmitPropertyListing(draftRequest));
    }

    @Test
    void editPropertyListing_Success() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertyListingUpdater).applyEdit(any(), any());
        when(propertyListingMapper.toResponse(any())).thenReturn(new PropertyListingResponse());
        PropertyListingResponse result = propertyListingService.editPropertyListing(editRequest);
        assertNotNull(result);
    }

    @Test
    void editPropertyListing_NotFound() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> propertyListingService.editPropertyListing(editRequest));
    }

    @Test
    void getPropertyListingById_Success() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        when(propertyListingMapper.toResponse(any())).thenReturn(new PropertyListingResponse());
        PropertyListingResponse result = propertyListingService.getPropertyListingById(id);
        assertNotNull(result);
    }

    @Test
    void getPropertyListingById_NotFound() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> propertyListingService.getPropertyListingById(id));
    }

    @Test
    void getPropertyListingPublicById_Success() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertyListingRepository).updateViewCount(id);
        when(propertyListingMapper.toPublicResponse(any())).thenReturn(new PropertyListingPublicResponse());
        PropertyListingPublicResponse result = propertyListingService.getPropertyListingPublicById(id);
        assertNotNull(result);
    }

    @Test
    void getPropertyListingPublicById_NotFound() {
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> propertyListingService.getPropertyListingPublicById(id));
    }

    @Test
    void getAllPropertyListings_Success() {
        when(propertyListingRepository.findAll()).thenReturn(List.of(propertyListing));
        when(propertyListingMapper.toCompactResponse(any())).thenReturn(new CompactPropertyListingResponse());
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPropertyListings();
        assertNotNull(result);
    }

    @Test
    void getAllPublishedPropertyListings_Success() {
        when(propertyListingRepository.findAllPublishedListings()).thenReturn(List.of(propertyListing));
        when(propertyListingMapper.toCompactResponse(any())).thenReturn(new CompactPropertyListingResponse());
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPublishedPropertyListings();
        assertNotNull(result);
    }

    @Test
    void getAllPropertyListingsBySellerAndStatus_Success() {
        when(propertyListingRepository.findAllBySellerAndStatus(any(), any())).thenReturn(List.of(propertyListing));
        when(propertyListingMapper.toCompactResponse(any())).thenReturn(new CompactPropertyListingResponse());
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPropertyListingsBySellerAndStatus(UUID.randomUUID(), PropertyListingStatus.PENDING);
        assertNotNull(result);
    }

    @Test
    void getAllPropertyListingsByStatus_Success() {
        when(propertyListingRepository.findByStatus(any())).thenReturn(List.of(propertyListing));
        when(propertyListingMapper.toCompactResponse(any())).thenReturn(new CompactPropertyListingResponse());
        List<CompactPropertyListingResponse> result = propertyListingService.getAllPropertyListingsByStatus(PropertyListingStatus.PENDING);
        assertNotNull(result);
    }

    @Test
    void getUserPropertyListingStatuses_Success() {
        when(propertyListingRepository.findDistinctStatusesByUserId(any())).thenReturn(List.of(PropertyListingStatus.PENDING));
        List<PropertyListingStatus> result = propertyListingService.getUserPropertyListingStatuses(UUID.randomUUID());
        assertNotNull(result);
    }

    @Test
    void getUserPropertyListings_Success() {
        when(propertyListingRepository.findBySeller_Id(any())).thenReturn(List.of(propertyListing));
        when(propertyListingMapper.toCompactResponse(any())).thenReturn(new CompactPropertyListingResponse());
        List<CompactPropertyListingResponse> result = propertyListingService.getUserPropertyListings(UUID.randomUUID());
        assertNotNull(result);
    }

    @Test
    void deletePropertyListing_WithReview() {
        when(propertySubmissionReviewRepository.existsById(id)).thenReturn(true);
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertySubmissionReviewService).deletePropertySubmissionReview(id);
        doNothing().when(propertyListingRepository).delete(any());
        propertyListingService.deletePropertyListing(id);
        verify(propertySubmissionReviewService).deletePropertySubmissionReview(id);
        verify(propertyListingRepository).delete(propertyListing);
    }

    @Test
    void deletePropertyListing_WithoutReview() {
        when(propertySubmissionReviewRepository.existsById(id)).thenReturn(false);
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        doNothing().when(propertyListingRepository).delete(any());
        propertyListingService.deletePropertyListing(id);
        verify(propertyListingRepository).delete(propertyListing);
    }

    @Test
    void deletePropertyListing_NotFound() {
        when(propertySubmissionReviewRepository.existsById(id)).thenReturn(false);
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> propertyListingService.deletePropertyListing(id));
    }

    @Test
    void toggleSaveProperty_Save_Success() {
        // Arrange
        UUID userId = user.getId();
        propertyListing.setSavedByUsers(new ArrayList<>()); // Ensure list is mutable
        
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);

        // Act
        propertyListingService.toggleSaveProperty(id, userId);

        // Assert
        verify(propertyListingRepository).save(propertyListing);
        assert(propertyListing.getSavedByUsers().contains(user));
    }

    @Test
    void toggleSaveProperty_Unsave_Success() {
        // Arrange
        UUID userId = user.getId();
        List<User> savedBy = new ArrayList<>();
        savedBy.add(user);
        propertyListing.setSavedByUsers(savedBy);

        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(propertyListingRepository.save(any(PropertyListing.class))).thenReturn(propertyListing);

        // Act
        propertyListingService.toggleSaveProperty(id, userId);

        // Assert
        verify(propertyListingRepository).save(propertyListing);
        assert(!propertyListing.getSavedByUsers().contains(user));
    }

    @Test
    void toggleSaveProperty_ListingNotFound() {
        UUID userId = UUID.randomUUID();
        when(propertyListingRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> propertyListingService.toggleSaveProperty(id, userId));
    }

    @Test
    void toggleSaveProperty_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(propertyListingRepository.findById(id)).thenReturn(Optional.of(propertyListing));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> propertyListingService.toggleSaveProperty(id, userId));
    }

    @Test
    void getUserSavedPropertyIds_Success() {
        UUID userId = UUID.randomUUID();
        List<UUID> expectedIds = List.of(UUID.randomUUID(), UUID.randomUUID());
        
        when(userRepository.existsById(userId)).thenReturn(true);
        when(propertyListingRepository.findSavedListingIdsByUserId(userId)).thenReturn(expectedIds);

        List<UUID> result = propertyListingService.getUserSavedPropertyIds(userId);

        assertNotNull(result);
        assert(result.size() == 2);
        verify(propertyListingRepository).findSavedListingIdsByUserId(userId);
    }

    @Test
    void getUserSavedPropertyIds_UserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> propertyListingService.getUserSavedPropertyIds(userId));
    }
}
