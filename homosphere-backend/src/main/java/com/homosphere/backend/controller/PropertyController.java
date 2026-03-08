package com.homosphere.backend.controller;

import com.homosphere.backend.dto.PropertySearchParams;
import com.homosphere.backend.dto.property.request.PropertyListingStatusUpdateRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyAdminResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService propertyService;

    @GetMapping("/search")
    public Page<CompactPropertyListingResponse> searchProperties(
        @RequestParam("q") String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "8") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return propertyService.searchProperties(query, pageRequest);
    }

    @GetMapping("/filter")
    public Page<CompactPropertyListingResponse> filterProperties(
        @RequestParam(required = false) Integer bedrooms,
        @RequestParam(required = false) Integer bathrooms,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) Integer age,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String state,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "8") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return propertyService.filterProperties(bedrooms, bathrooms, minPrice, maxPrice, age, city, state, pageRequest);
    }

    @GetMapping("/{id}")
    public PropertyListingResponse getPropertyListingDetails(@PathVariable("id") UUID propertyListingId) {
        return propertyService.getPropertyListingDetails(propertyListingId);
    }

    @GetMapping("/all-types")
    public ResponseEntity<List<String>> getAllTypes() {
        List<String> propertyTypes = propertyService.getAllPropertyTypes();
        return new ResponseEntity<>(propertyTypes, HttpStatus.OK);
    }
    
    @GetMapping("/all-conditions")
    public ResponseEntity<List<String>> getAllConditions() {
        List<String> propertyConditions = propertyService.getAllConditions();
        return new ResponseEntity<>(propertyConditions, HttpStatus.OK);
    }

    @GetMapping("/admin/all-partitioned")
    public ResponseEntity<PropertyAdminResponse> getAllPropertiesPartitionedByStatus() {
        return ResponseEntity.ok(propertyService.getAllPropertiesPartitionedByStatus());
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllPendingProperties() {
        return ResponseEntity.ok(propertyService.getAllPendingProperties());
    }

    @GetMapping("/admin/published")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllPublishedProperties() {
        return ResponseEntity.ok(propertyService.getAllPublishedProperties());
    }

    @GetMapping("/admin/rejected")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllRejectedProperties() {
        return ResponseEntity.ok(propertyService.getAllRejectedProperties());
    }

    @GetMapping("/admin/requires-changes")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllRequiresChangesProperties() {
        return ResponseEntity.ok(propertyService.getAllRequiresChangesProperties());
    }

    @GetMapping("/admin/unlisted")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllUnlistedProperties() {
        return ResponseEntity.ok(propertyService.getAllUnlistedProperties());
    }

    @GetMapping("/admin/sold")
    public ResponseEntity<List<CompactPropertyListingResponse>> getAllSoldProperties() {
        return ResponseEntity.ok(propertyService.getAllSoldProperties());
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updatePropertyListingStatus(@RequestBody PropertyListingStatusUpdateRequest request) {
        propertyService.updatePropertyListingStatus(request.getPropertyListingId(), request.getStatus());
        return ResponseEntity.ok().build();
    }
}
