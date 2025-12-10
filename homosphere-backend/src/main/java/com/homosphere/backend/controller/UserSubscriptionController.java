package com.homosphere.backend.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.UpdateSubscriptionTierDTO;
import com.homosphere.backend.dto.UserSubscriptionRoleTierDTO;
import com.homosphere.backend.model.UserSubscription;
import com.homosphere.backend.repository.UserSubscriptionRepository;
import com.homosphere.backend.service.UserSubscriptionService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user-subscriptions")
public class UserSubscriptionController {

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    @Autowired
    private UserSubscriptionService userSubscriptionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSubscription> getAllUserSubscriptions() {
        return userSubscriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSubscription> getUserSubscriptionById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return userSubscriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-subscriptions")
    public ResponseEntity<List<UserSubscription>> getMySubscriptions(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        return ResponseEntity.ok(userSubscriptionRepository.findByUserId(uuid));
    }

    @GetMapping("/my-role-tier")
    public ResponseEntity<List<UserSubscriptionRoleTierDTO>> getMyRoleAndTier(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        List<UserSubscriptionRoleTierDTO> result = userSubscriptionRepository.findByUserId(uuid).stream()
                .map(sub -> new UserSubscriptionRoleTierDTO(
                        sub.getSubscription().getSubscriptionId(),
                        sub.getUser().getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
    
    // Keep for public or admin access
    @GetMapping("/user/{userId}/role-tier")
    public ResponseEntity<List<UserSubscriptionRoleTierDTO>> getUserRoleAndTier(@PathVariable UUID userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<UserSubscriptionRoleTierDTO> result = userSubscriptionRepository.findByUserId(userId).stream()
                .map(sub -> new UserSubscriptionRoleTierDTO(
                        sub.getSubscription().getSubscriptionId(),
                        sub.getUser().getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<UserSubscription> createUserSubscription(@Valid @RequestBody UserSubscription userSubscription) {
        if (userSubscription == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userSubscriptionRepository.save(userSubscription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSubscription> updateUserSubscription(@PathVariable Long id, @Valid @RequestBody UserSubscription userSubscriptionDetails) {
        if (id == null || id <= 0 || userSubscriptionDetails == null) {
            return ResponseEntity.badRequest().build();
        }
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

    @PutMapping("/update-my-tier")
    public ResponseEntity<UserSubscription> updateMySubscriptionTier(
            @Valid @RequestBody UpdateSubscriptionTierDTO updateDTO,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        if (updateDTO == null) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            String userId = authentication.getPrincipal().toString();
            UUID uuid = UUID.fromString(userId);
            UserSubscription updated = userSubscriptionService.updateTier(uuid, updateDTO);
            return ResponseEntity.ok(updated);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Keep for admin operations
    @PutMapping("/user/{userId}/update-tier")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserSubscription> updateUserSubscriptionTier(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateSubscriptionTierDTO updateDTO) {

        if (userId == null || updateDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            UserSubscription updated = userSubscriptionService.updateTier(userId, updateDTO);
            return ResponseEntity.ok(updated);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserSubscription(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (userSubscriptionRepository.existsById(id)) {
            userSubscriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
