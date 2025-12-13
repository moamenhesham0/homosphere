package com.homosphere.backend.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homosphere.backend.dto.UpdateSubscriptionTierDTO;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.SubscriptionTierRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

@ExtendWith(MockitoExtension.class)
class UserSubscriptionServiceTest {

    @Mock
    private UserSubscriptionRepository userSubscriptionRepository;

    @Mock
    private SubscriptionTierRepository subscriptionTierRepository;

    @InjectMocks
    private UserSubscriptionService userSubscriptionService;

    private UUID userId;
    private UserSubscription activeSubscription;
    private SubscriptionTier newTier;
    private UpdateSubscriptionTierDTO updateDTO;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        
        User user = new User();
        user.setId(userId);
        
        activeSubscription = new UserSubscription();
        activeSubscription.setUserSubscriptionId(1L);
        activeSubscription.setUser(user);
        activeSubscription.setStatus(UserSubscription.Status.ACTIVE);
        
        newTier = new SubscriptionTier();
        newTier.setSubscriptionId(2L);
        newTier.setName("Premium");
        
        updateDTO = new UpdateSubscriptionTierDTO();
        updateDTO.setNewSubscriptionTierId(2L);
        updateDTO.setFrequency(UserSubscription.PaymentFrequency.MONTHLY);
        updateDTO.setStartDate(LocalDate.now());
        updateDTO.setEndDate(LocalDate.now().plusMonths(1));
    }

    @Test
    void updateTier_WithActiveSubscription_UpdatesSuccessfully() {
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(activeSubscription));
        when(subscriptionTierRepository.findById(2L))
            .thenReturn(Optional.of(newTier));
        when(userSubscriptionRepository.save(any(UserSubscription.class)))
            .thenReturn(activeSubscription);

        UserSubscription result = userSubscriptionService.updateTier(userId, updateDTO);

        assertNotNull(result);
        verify(userSubscriptionRepository).save(activeSubscription);
        assertEquals(newTier, activeSubscription.getSubscription());
        assertEquals(UserSubscription.PaymentFrequency.MONTHLY, activeSubscription.getFrequency());
    }

    @Test
    void updateTier_NoActiveSubscription_ThrowsException() {
        UserSubscription inactiveSubscription = new UserSubscription();
        inactiveSubscription.setStatus(UserSubscription.Status.INACTIVE);
        
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(inactiveSubscription));

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> userSubscriptionService.updateTier(userId, updateDTO));
        
        assertTrue(exception.getMessage().contains("No active subscription found"));
        verify(userSubscriptionRepository, never()).save(any());
    }

    @Test
    void updateTier_NoSubscriptions_ThrowsException() {
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList());

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> userSubscriptionService.updateTier(userId, updateDTO));
        
        assertNotNull(exception);
    }

    @Test
    void updateTier_InvalidTierId_ThrowsException() {
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(activeSubscription));
        when(subscriptionTierRepository.findById(2L))
            .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> userSubscriptionService.updateTier(userId, updateDTO));
        
        assertTrue(exception.getMessage().contains("Subscription tier not found"));
    }

    @Test
    void updateTier_WithNullOptionalFields_UpdatesOnlyRequiredFields() {
        updateDTO.setFrequency(null);
        updateDTO.setStartDate(null);
        updateDTO.setEndDate(null);
        
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(Arrays.asList(activeSubscription));
        when(subscriptionTierRepository.findById(2L))
            .thenReturn(Optional.of(newTier));
        when(userSubscriptionRepository.save(any(UserSubscription.class)))
            .thenReturn(activeSubscription);

        UserSubscription result = userSubscriptionService.updateTier(userId, updateDTO);

        assertNotNull(result);
        verify(userSubscriptionRepository).save(activeSubscription);
    }

    @Test
    void updateTier_MultipleSubscriptions_FindsActive() {
        UserSubscription inactiveSubscription = new UserSubscription();
        inactiveSubscription.setStatus(UserSubscription.Status.INACTIVE);
        
        List<UserSubscription> subscriptions = Arrays.asList(inactiveSubscription, activeSubscription);
        
        when(userSubscriptionRepository.findByUser_Id(userId))
            .thenReturn(subscriptions);
        when(subscriptionTierRepository.findById(2L))
            .thenReturn(Optional.of(newTier));
        when(userSubscriptionRepository.save(any(UserSubscription.class)))
            .thenReturn(activeSubscription);

        UserSubscription result = userSubscriptionService.updateTier(userId, updateDTO);

        assertNotNull(result);
        assertEquals(activeSubscription, result);
    }
}
