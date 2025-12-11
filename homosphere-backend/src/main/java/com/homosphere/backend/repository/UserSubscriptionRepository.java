package com.homosphere.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.homosphere.backend.model.UserSubscription;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    @Query("SELECT us FROM UserSubscription us WHERE us.user.id = ?1")
    List<UserSubscription> findByUser_Id(UUID userId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM UserSubscription us WHERE us.user.id = ?1")
    void deleteByUser_Id(UUID userId);
}
