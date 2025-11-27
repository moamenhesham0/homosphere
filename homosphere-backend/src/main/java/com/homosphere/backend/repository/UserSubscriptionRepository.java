package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.model.UserSubscription;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UUID> {
    List<UserSubscription> findByUserId(UUID userId);
}
