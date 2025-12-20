package com.homosphere.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.service.PropertyListingService;

@RestController
@RequestMapping("/api/property-listing")
public class PropertyListingController {

    @Autowired
    private PropertyListingService propertyListingService;

    /**
     * Create a new property listing
     */
    @PostMapping
    public ResponseEntity<?> createPropertyListing(
            @RequestBody PropertyListingRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        try {
            PropertyListingResponse response = propertyListingService.createPropertyListing(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create property listing: " + e.getMessage()));
        }
    }

    /**
     * Get all property listings (compact view)
     */
    @GetMapping
    public ResponseEntity<?> getAllPropertyListings() {
        try {
            List<CompactPropertyListingResponse> listings = propertyListingService.getAllPropertyListings();
            return ResponseEntity.ok(listings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch property listings: " + e.getMessage()));
        }
    }

    /**
     * Get a single property listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyListingById(@PathVariable UUID id) {
        try {
            PropertyListingResponse response = propertyListingService.getPropertyListingById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch property listing: " + e.getMessage()));
        }
    }

    /**
     * Update a property listing
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePropertyListing(
            @PathVariable UUID id,
            @RequestBody PropertyListingRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        try {
            PropertyListingResponse response = propertyListingService.updatePropertyListing(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update property listing: " + e.getMessage()));
        }
    }

    /**
     * Delete a property listing
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePropertyListing(
            @PathVariable UUID id,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        try {
            propertyListingService.deletePropertyListing(id);
            return ResponseEntity.ok(Map.of("message", "Property listing deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete property listing: " + e.getMessage()));
        }
    }
}
