package com.homosphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homosphere.backend.model.UserSubscription;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    List<UserSubscription> findByUserId(Long userId);
}
