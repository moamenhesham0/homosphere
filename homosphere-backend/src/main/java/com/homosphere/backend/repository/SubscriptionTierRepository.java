package com.homosphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.model.SubscriptionTier;

public interface SubscriptionTierRepository extends JpaRepository<SubscriptionTier, Long> {
    List<SubscriptionTier> findBySellerTrue();
    List<SubscriptionTier> findBySellerFalse();
    List<SubscriptionTier> findBySeller(boolean seller);

    SubscriptionTier findByName(String name);
}
