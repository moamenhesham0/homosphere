package com.homosphere.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.repository.SubscriptionTierRepository;

@ExtendWith(MockitoExtension.class)
class SubscriptionTierControllerTest {

    @Mock
    private SubscriptionTierRepository subscriptionTierRepository;

    @InjectMocks
    private SubscriptionTierController subscriptionTierController;

    private SubscriptionTier tier;
    private Long tierId;
    private List<SubscriptionTier> tierList;

    @BeforeEach
    void setUp() {
        tierId = 1L;
        
        tier = new SubscriptionTier();
        tier.setSubscriptionId(tierId);
        tier.setName("Premium");
        tier.setMonthlyPrice(99.99);
        tier.setSeller(false);

        SubscriptionTier tier2 = new SubscriptionTier();
        tier2.setSubscriptionId(2L);
        tier2.setName("Basic");
        tier2.setMonthlyPrice(49.99);
        tier2.setSeller(true);

        tierList = Arrays.asList(tier, tier2);
    }

    @Test
    void getAllSubscriptionTiers_ReturnsAllTiers() {
        when(subscriptionTierRepository.findAll()).thenReturn(tierList);

        List<SubscriptionTier> response = subscriptionTierController.getAllSubscriptionTiers();

        assertNotNull(response);
        assertEquals(2, response.size());
        verify(subscriptionTierRepository, times(1)).findAll();
    }

    @Test
    void getAllSubscriptionTiers_WhenEmpty_ReturnsEmptyList() {
        when(subscriptionTierRepository.findAll()).thenReturn(List.of());

        List<SubscriptionTier> response = subscriptionTierController.getAllSubscriptionTiers();

        assertTrue(response.isEmpty());
    }

    @Test
    void createSubscriptionTier_WithValidData_ReturnsCreated() {
        when(subscriptionTierRepository.save(any(SubscriptionTier.class))).thenReturn(tier);

        ResponseEntity<SubscriptionTier> response = subscriptionTierController.createSubscriptionTier(tier);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Premium", response.getBody().getName());
        verify(subscriptionTierRepository, times(1)).save(tier);
    }

    @Test
    void createSubscriptionTier_WithNullData_ReturnsBadRequest() {
        ResponseEntity<SubscriptionTier> response = subscriptionTierController.createSubscriptionTier(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(subscriptionTierRepository, never()).save(any());
    }

    @Test
    void getSubscriptionTierById_WithValidId_ReturnsTier() {
        when(subscriptionTierRepository.findById(tierId)).thenReturn(Optional.of(tier));

        ResponseEntity<SubscriptionTier> response = subscriptionTierController.getSubscriptionTierById(tierId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(tierId, response.getBody().getSubscriptionId());
        verify(subscriptionTierRepository, times(1)).findById(tierId);
    }

    @Test
    void getSubscriptionTierById_WithInvalidId_ReturnsNotFound() {
        Long invalidId = 999L;
        when(subscriptionTierRepository.findById(invalidId)).thenReturn(Optional.empty());

        ResponseEntity<SubscriptionTier> response = subscriptionTierController.getSubscriptionTierById(invalidId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getSubscriptionTierById_WithNullId_ReturnsBadRequest() {
        ResponseEntity<SubscriptionTier> response = subscriptionTierController.getSubscriptionTierById(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void getSellerSubscriptionTiers_ReturnsSellerTiers() {
        List<SubscriptionTier> sellerTiers = List.of(tierList.get(1));
        when(subscriptionTierRepository.findBySellerTrue()).thenReturn(sellerTiers);

        List<SubscriptionTier> response = subscriptionTierController.getSellerSubscriptionTiers();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertTrue(response.get(0).isSeller());
        verify(subscriptionTierRepository, times(1)).findBySellerTrue();
    }

    @Test
    void getBuyerSubscriptionTiers_ReturnsBuyerTiers() {
        List<SubscriptionTier> buyerTiers = List.of(tierList.get(0));
        when(subscriptionTierRepository.findBySellerFalse()).thenReturn(buyerTiers);

        List<SubscriptionTier> response = subscriptionTierController.getBuyerSubscriptionTiers();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertFalse(response.get(0).isSeller());
        verify(subscriptionTierRepository, times(1)).findBySellerFalse();
    }

    @Test
    void getSubscriptionTiersByRole_WithBuyerRole_ReturnsBuyerTiers() {
        when(subscriptionTierRepository.findBySeller(false)).thenReturn(List.of(tier));

        ResponseEntity<List<SubscriptionTier>> response = 
            subscriptionTierController.getSubscriptionTiersByRole("buyer");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(subscriptionTierRepository, times(1)).findBySeller(false);
    }

    @Test
    void getSubscriptionTiersByRole_WithSellerRole_ReturnsSellerTiers() {
        when(subscriptionTierRepository.findBySeller(true)).thenReturn(List.of(tierList.get(1)));

        ResponseEntity<List<SubscriptionTier>> response = 
            subscriptionTierController.getSubscriptionTiersByRole("seller");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(subscriptionTierRepository, times(1)).findBySeller(true);
    }

    @Test
    void getSubscriptionTiersByRole_WithInvalidRole_ReturnsNotFound() {
        ResponseEntity<List<SubscriptionTier>> response = 
            subscriptionTierController.getSubscriptionTiersByRole("invalid");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void updateSubscriptionTier_WithValidData_ReturnsUpdated() {
        SubscriptionTier updatedTier = new SubscriptionTier();
        updatedTier.setName("Premium Plus");
        updatedTier.setMonthlyPrice(199.99);
        
        when(subscriptionTierRepository.findById(tierId)).thenReturn(Optional.of(tier));
        when(subscriptionTierRepository.save(any(SubscriptionTier.class))).thenReturn(tier);

        ResponseEntity<SubscriptionTier> response = 
            subscriptionTierController.updateSubscriptionTier(tierId, updatedTier);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(subscriptionTierRepository, times(1)).save(any());
    }

    @Test
    void updateSubscriptionTier_WithInvalidId_ReturnsNotFound() {
        Long invalidId = 999L;
        when(subscriptionTierRepository.findById(invalidId)).thenReturn(Optional.empty());

        ResponseEntity<SubscriptionTier> response = 
            subscriptionTierController.updateSubscriptionTier(invalidId, tier);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteSubscriptionTier_WithValidId_ReturnsNoContent() {
        when(subscriptionTierRepository.findById(tierId)).thenReturn(Optional.of(tier));
        doNothing().when(subscriptionTierRepository).delete(tier);

        ResponseEntity<Void> response = subscriptionTierController.deleteSubscriptionTier(tierId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(subscriptionTierRepository, times(1)).delete(tier);
    }

    @Test
    void deleteSubscriptionTier_WithInvalidId_ReturnsNotFound() {
        Long invalidId = 999L;
        when(subscriptionTierRepository.findById(invalidId)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = subscriptionTierController.deleteSubscriptionTier(invalidId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(subscriptionTierRepository, never()).delete(any());
    }
}
