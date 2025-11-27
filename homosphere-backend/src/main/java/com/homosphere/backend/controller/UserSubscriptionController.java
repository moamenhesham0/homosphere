package com.homosphere.backend.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.UserSubscriptionRoleTierDTO;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.UserSubscriptionRepository;

@RestController
@RequestMapping("/api/user-subscriptions")
public class UserSubscriptionController {

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @GetMapping
    public List<UserSubscription> getAllUserSubscriptions() {
        return userSubscriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSubscription> getUserSubscriptionById(@PathVariable UUID id) {
        return userSubscriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<UserSubscription> getUserSubscriptionsByUserId(@PathVariable UUID userId) {
        return userSubscriptionRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/role-tier")
    public List<UserSubscriptionRoleTierDTO> getUserRoleAndTier(@PathVariable UUID userId) {
        return userSubscriptionRepository.findByUserId(userId).stream()
                .map(sub -> new UserSubscriptionRoleTierDTO(
                        sub.getSubscription().getSubscriptionId(),
                        sub.getUser().getRole()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public UserSubscription createUserSubscription(@RequestBody UserSubscription userSubscription) {
        return userSubscriptionRepository.save(userSubscription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSubscription> updateUserSubscription(@PathVariable UUID id, @RequestBody UserSubscription userSubscriptionDetails) {
        return userSubscriptionRepository.findById(id)
                .map(userSubscription -> {
                    userSubscription.setStartDate(userSubscriptionDetails.getStartDate());
                    userSubscription.setEndDate(userSubscriptionDetails.getEndDate());
                    userSubscription.setFrequency(userSubscriptionDetails.getFrequency());
                    userSubscription.setStatus(userSubscriptionDetails.getStatus());
                    userSubscription.setCancellationDate(userSubscriptionDetails.getCancellationDate());
                    userSubscription.setCancellationReason(userSubscriptionDetails.getCancellationReason());
                    return ResponseEntity.ok(userSubscriptionRepository.save(userSubscription));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserSubscription(@PathVariable UUID id) {
        if (userSubscriptionRepository.existsById(id)) {
            userSubscriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
