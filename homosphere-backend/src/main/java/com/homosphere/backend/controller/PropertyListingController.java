package com.homosphere.backend.controller;

import java.util.List;
import java.util.UUID;

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

    @PostMapping("/sumbit")
    public ResponseEntity<PropertyListingResponse> submitPropertyListing(@RequestBody PropertyListingRequest request) {
        PropertyListingResponse response = propertyListingService.submitPropertyListing(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/draft")
    public ResponseEntity<PropertyListingResponse> savePropertyListingDraft(@RequestBody PropertyListingRequest request) {
        PropertyListingResponse response = propertyListingService.saveDraftPropertyListing(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/update-draft")
    public ResponseEntity<PropertyListingResponse> updatePropertyListingDraft(@RequestBody PropertyListingDraftRequest draftRequest) {
        PropertyListingResponse response = propertyListingService.updatePropertyListingDraft(draftRequest);
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
}
