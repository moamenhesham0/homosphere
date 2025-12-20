package com.homosphere.backend.controller;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

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
}
