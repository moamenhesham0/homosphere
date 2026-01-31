package com.homosphere.backend.controller;

import java.util.List;
import java.util.UUID;
import java.util.Collections;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.property.request.PropertyListingDraftRequest;
import com.homosphere.backend.dto.property.request.PropertyListingEditRequest;
import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.enums.PropertyListingStatus;
import com.homosphere.backend.service.PropertyListingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/property-listing")
@RequiredArgsConstructor
public class PropertyListingController {

    private final PropertyListingService propertyListingService;

    @PostMapping("/submit")
    public ResponseEntity<PropertyListingResponse> submitPropertyListing(@RequestBody PropertyListingRequest request) {
        PropertyListingResponse response = propertyListingService.submitPropertyListing(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/resubmit")
    public ResponseEntity<PropertyListingResponse> updatePropertyListingDraft(@RequestBody PropertyListingDraftRequest draftRequest) {
        PropertyListingResponse response = propertyListingService.resubmitPropertyListing(draftRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity<PropertyListingResponse> editPropertyListing(@RequestBody PropertyListingEditRequest editRequest) {
        PropertyListingResponse response = propertyListingService.editPropertyListing(editRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePropertyListing(@PathVariable("id") UUID propertyListingId) {
        propertyListingService.deletePropertyListing(propertyListingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyListingResponse> getPropertyListingById(@PathVariable("id") UUID propertyListingId) {
        PropertyListingResponse response = propertyListingService.getPropertyListingById(propertyListingId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PropertyListingPublicResponse> getPublicPropertyListingById(@PathVariable("id") UUID propertyListingId) {
        PropertyListingPublicResponse publicResponse = propertyListingService.getPropertyListingPublicById(propertyListingId);
        return new ResponseEntity<>(publicResponse, HttpStatus.OK);
    }

    @GetMapping("store")
    public ResponseEntity<List<CompactPropertyListingResponse>> getPropertyListingStore() {
        List<CompactPropertyListingResponse> response = propertyListingService.getAllPublishedPropertyListings();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("status/{userId}")
    public ResponseEntity<List<PropertyListingStatus>> getUserPropertyListingTabs(@PathVariable ("userId") UUID userId) {
        List<PropertyListingStatus> response = propertyListingService.getUserPropertyListingStatuses(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<CompactPropertyListingResponse>> getUserPropertyListings(@PathVariable ("userId") UUID userId) {
        List<CompactPropertyListingResponse> response = propertyListingService.getUserPropertyListings(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/public/user/{userId}")
    public ResponseEntity<List<CompactPropertyListingResponse>> getPublishedPropertyListingsByUser(@PathVariable("userId") UUID userId) {
        List<CompactPropertyListingResponse> response = propertyListingService.getPublishedPropertyListingsByUser(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/public/user/{id}/save/{userId}")
    public ResponseEntity<?> toggleSaveProperty(@PathVariable UUID id, @PathVariable UUID userId) {
        try {
            
            propertyListingService.toggleSaveProperty(id, userId);
            return ResponseEntity.ok().body("{\"message\": \"Property save state updated\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/public/user/saved-ids/{userId}")
    public ResponseEntity<List<UUID>> getSavedPropertyIds(@PathVariable UUID userId) {
        try {    
            List<UUID> savedIds = propertyListingService.getUserSavedPropertyIds(userId);
            return ResponseEntity.ok(savedIds);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList()); 
        }
    }

    @GetMapping("/saved/{userId}")
    public ResponseEntity<List<CompactPropertyListingResponse>> getSavedPropertyListings(@PathVariable UUID userId) {
        List<CompactPropertyListingResponse> response = propertyListingService.getSavedPropertyListings(userId);
        return ResponseEntity.ok(response);
    }
}
