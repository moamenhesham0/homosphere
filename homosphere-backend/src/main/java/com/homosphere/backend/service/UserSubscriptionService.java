package com.homosphere.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.homosphere.backend.dto.UpdateSubscriptionTierDTO;
import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.SubscriptionTierRepository;
import com.homosphere.backend.repository.UserSubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSubscriptionService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionTierRepository subscriptionTierRepository;

    public UserSubscription updateTier(UUID userId, UpdateSubscriptionTierDTO updateDTO) {
        UserSubscription sub = findActiveSubscription(userId);
        SubscriptionTier newTier = findTier(updateDTO.getNewSubscriptionTierId());
    
        sub.setSubscription(newTier);
    
        Optional.ofNullable(updateDTO.getFrequency()).ifPresent(sub::setFrequency);
        Optional.ofNullable(updateDTO.getStartDate()).ifPresent(sub::setStartDate);
        Optional.ofNullable(updateDTO.getEndDate()).ifPresent(sub::setEndDate);
    
        return userSubscriptionRepository.save(sub);
    }

    private UserSubscription findActiveSubscription(UUID userId) {
        List<UserSubscription> subscriptions = userSubscriptionRepository.findByUserId(userId);
        return subscriptions.stream()
                .filter(sub -> sub.getStatus() == UserSubscription.Status.ACTIVE)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active subscription found for user: " + userId));
    }

    private SubscriptionTier findTier(Long tierId) {
        return subscriptionTierRepository.findById(tierId)
                .orElseThrow(() -> new RuntimeException("Subscription tier not found: " + tierId));
    }
}