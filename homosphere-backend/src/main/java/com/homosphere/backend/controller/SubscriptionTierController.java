package com.homosphere.backend.controller;

import java.util.List;

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

import com.homosphere.backend.model.SubscriptionTier;
import com.homosphere.backend.repository.SubscriptionTierRepository;

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
    public SubscriptionTier createSubscriptionTier(@RequestBody SubscriptionTier subscriptionTier) {
        return subscriptionTierRepository.save(subscriptionTier);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionTier> getSubscriptionTierById(@PathVariable Long id) {
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

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionTier> updateSubscriptionTier(@PathVariable Long id, @RequestBody SubscriptionTier subscriptionTierDetails) {
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
    public ResponseEntity<Void> deleteSubscriptionTier(@PathVariable Long id) {
        return subscriptionTierRepository.findById(id)
                .map(subscriptionTier -> {
                    subscriptionTierRepository.delete(subscriptionTier);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}