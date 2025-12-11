package com.homosphere.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.PropertyStatsDTO;
import com.homosphere.backend.dto.UserSubscriptionAnalyticsDTO;
import com.homosphere.backend.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class analyticController {
    
    private final AnalyticsService analyticsService;

    @GetMapping("/property/{id}")
    public ResponseEntity<PropertyStatsDTO> getPropertyStats(
            @PathVariable UUID id, 
            Authentication authentication) {
        
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        // Get user ID from authentication
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        
        // Fetch stats from service
        PropertyStatsDTO stats = analyticsService.getPropertyStats(id, uuid);
        
        if (stats == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(stats); 
    }

    @GetMapping("/properties/user")
    public ResponseEntity<List<Map<String, Object>>> getUserProperties(Authentication authentication) {
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        // Get user ID from authentication
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        
        // Fetch user properties from service
        List<Map<String, Object>> properties = analyticsService.getUserProperties(uuid);
        
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/subscriptions/user")
    public ResponseEntity<UserSubscriptionAnalyticsDTO> getUserSubscriptionAnalytics(Authentication authentication) {
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        // Get user ID from authentication
        String userId = authentication.getPrincipal().toString();
        UUID uuid = UUID.fromString(userId);
        
        // Fetch subscription analytics
        UserSubscriptionAnalyticsDTO analytics = analyticsService.getUserSubscriptionDetails(uuid);
        
        if (analytics == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(analytics);
    }
}