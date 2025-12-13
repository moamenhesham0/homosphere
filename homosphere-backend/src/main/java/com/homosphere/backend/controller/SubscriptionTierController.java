package com.homosphere.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.repository.SubscriptionTierRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subscription-tiers")
public class SubscriptionTierController {
    @Autowired
    private SubscriptionTierRepository subscriptionTierRepository;

    @GetMapping
    public List<SubscriptionTier> getAllSubscriptionTiers() {
        return subscriptionTierRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionTier> createSubscriptionTier(@Valid @RequestBody SubscriptionTier subscriptionTier) {
        if (subscriptionTier == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(subscriptionTierRepository.save(subscriptionTier));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionTier> getSubscriptionTierById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return subscriptionTierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/seller-tiers")
    public List<SubscriptionTier> getSellerSubscriptionTiers() {
        return subscriptionTierRepository.findBySellerTrue();
    }

    @GetMapping("/buyer-tiers")
    public List<SubscriptionTier> getBuyerSubscriptionTiers() {
        return subscriptionTierRepository.findBySellerFalse();
    }

    @GetMapping("/{role}-tiers")
    public ResponseEntity<List<SubscriptionTier>> getSubscriptionTiersByRole(@PathVariable String role) {
        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        final String normalizedRole = role.trim().toLowerCase();
        Boolean isSellerRole = switch (normalizedRole) {
            case "seller", "broker" -> true;
            case "buyer" -> false;
            default -> null;
        };

        if (isSellerRole == null) {
            return ResponseEntity.notFound().build();
        }

        List<SubscriptionTier> tiers = subscriptionTierRepository.findBySeller(isSellerRole);
        return ResponseEntity.ok(tiers);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionTier> updateSubscriptionTier(@PathVariable Long id, @Valid @RequestBody SubscriptionTier subscriptionTierDetails) {
        if (id == null || id <= 0 || subscriptionTierDetails == null) {
            return ResponseEntity.badRequest().build();
        }
        return subscriptionTierRepository.findById(id)
                .map(subscriptionTier -> {
                    subscriptionTier.setName(subscriptionTierDetails.getName());
                    subscriptionTier.setSeller(subscriptionTierDetails.isSeller());
                    subscriptionTier.setMonthlyPrice(subscriptionTierDetails.getMonthlyPrice());
                    subscriptionTier.setYearlyPrice(subscriptionTierDetails.getYearlyPrice());
                    subscriptionTier.setVisibilityPriority(subscriptionTierDetails.getVisibilityPriority());
                    subscriptionTier.setDescription(subscriptionTierDetails.getDescription());
                    subscriptionTier.setPopular(subscriptionTierDetails.isPopular());
                    subscriptionTier.setFeatures(subscriptionTierDetails.getFeatures());
                    SubscriptionTier updatedSubscriptionTier = subscriptionTierRepository.save(subscriptionTier);
                    return ResponseEntity.ok(updatedSubscriptionTier);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubscriptionTier(@PathVariable Long id) {
        System.out.println("Deleting subscription tier with ID: " + id);
        if (id == null || id <= 0) {
            System.out.println("Invalid ID provided for deletion.");
            return ResponseEntity.badRequest().build();
        }
        return subscriptionTierRepository.findById(id)
                .map(subscriptionTier -> {
                    subscriptionTierRepository.delete(subscriptionTier);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}