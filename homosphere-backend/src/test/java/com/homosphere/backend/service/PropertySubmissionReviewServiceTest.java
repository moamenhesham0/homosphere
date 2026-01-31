package com.homosphere.backend.service;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.mapper.PropertySubmissionReviewMapper;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertySubmissionReviewRepository;

class PropertySubmissionReviewServiceTest {
    @Mock
    private PropertySubmissionReviewRepository reviewRepository;
    @Mock
    private PropertySubmissionReviewMapper reviewMapper;
    @Mock
    private PropertyListingRepository listingRepository;
    @InjectMocks
    private PropertySubmissionReviewService reviewService;
    private PropertySubmissionReviewService spyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        spyService = spy(reviewService);
    }

    @Test
    void createPropertySubmissionReview_createsNew_whenNotExists() {
        PropertySubmissionReviewRequest request = mock(PropertySubmissionReviewRequest.class);
        UUID id = UUID.randomUUID();
        when(request.getPropertyListingId()).thenReturn(id);
        when(reviewRepository.existsById(id)).thenReturn(false);
        PropertySubmissionReview entity = mock(PropertySubmissionReview.class);
        when(reviewMapper.toEntity(eq(request), any())).thenReturn(entity);
        PropertySubmissionReview saved = mock(PropertySubmissionReview.class);
        when(reviewRepository.save(entity)).thenReturn(saved);
        PropertySubmissionReviewResponse response = mock(PropertySubmissionReviewResponse.class);
        when(reviewMapper.toResponse(saved)).thenReturn(response);

        PropertySubmissionReviewResponse result = reviewService.createPropertySubmissionReview(request);
        assertEquals(response, result);
        verify(reviewRepository).save(entity);
    }

    @Test
    void createPropertySubmissionReview_updates_whenExists() {
        PropertySubmissionReviewRequest request = mock(PropertySubmissionReviewRequest.class);
        UUID id = UUID.randomUUID();
        when(request.getPropertyListingId()).thenReturn(id);
        when(reviewRepository.existsById(id)).thenReturn(true);
        PropertySubmissionReviewResponse response = mock(PropertySubmissionReviewResponse.class);
        doReturn(response).when(spyService).updatePropertySubmissionReview(request);

        PropertySubmissionReviewResponse result = spyService.createPropertySubmissionReview(request);
        assertEquals(response, result);
    }

    @Test
    void updatePropertySubmissionReview_throws_whenNotExists() {
        PropertySubmissionReviewRequest request = mock(PropertySubmissionReviewRequest.class);
        UUID id = UUID.randomUUID();
        when(request.getPropertyListingId()).thenReturn(id);
        when(reviewRepository.existsById(id)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> reviewService.updatePropertySubmissionReview(request));
    }

    @Test
    void updatePropertySubmissionReview_updates_whenExists() {
        PropertySubmissionReviewRequest request = mock(PropertySubmissionReviewRequest.class);
        UUID id = UUID.randomUUID();
        when(request.getPropertyListingId()).thenReturn(id);
        when(reviewRepository.existsById(id)).thenReturn(true);
        PropertySubmissionReview entity = mock(PropertySubmissionReview.class);
        when(reviewRepository.findById(id)).thenReturn(Optional.of(entity));
        PropertySubmissionReviewResponse response = mock(PropertySubmissionReviewResponse.class);
        when(reviewMapper.toResponse(entity)).thenReturn(response);

        PropertySubmissionReviewResponse result = reviewService.updatePropertySubmissionReview(request);
        assertEquals(response, result);
        verify(reviewRepository).save(entity);
    }

    @Test
    void deletePropertySubmissionReview_throws_whenNotExists() {
        UUID id = UUID.randomUUID();
        when(reviewRepository.existsById(id)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> reviewService.deletePropertySubmissionReview(id));
    }

    @Test
    void deletePropertySubmissionReview_deletes_whenExists() {
        UUID id = UUID.randomUUID();
        when(reviewRepository.existsById(id)).thenReturn(true);
        reviewService.deletePropertySubmissionReview(id);
        verify(reviewRepository).deleteById(id);
    }

    @Test
    void getPropertySubmissionReview_throws_whenNotFound() {
        UUID id = UUID.randomUUID();
        when(reviewRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> reviewService.getPropertySubmissionReview(id));
    }

    @Test
    void getPropertySubmissionReview_returns_whenFound() {
        UUID id = UUID.randomUUID();
        PropertySubmissionReview entity = mock(PropertySubmissionReview.class);
        when(reviewRepository.findById(id)).thenReturn(Optional.of(entity));
        PropertySubmissionReviewResponse response = mock(PropertySubmissionReviewResponse.class);
        when(reviewMapper.toResponse(entity)).thenReturn(response);
        PropertySubmissionReviewResponse result = reviewService.getPropertySubmissionReview(id);
        assertEquals(response, result);
    }
}
