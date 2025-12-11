package com.homosphere.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.ViewingRequestDTO;
import com.homosphere.backend.model.ViewingRequest;
import com.homosphere.backend.service.ViewingRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/viewing-requests")
@RequiredArgsConstructor
public class ViewingRequestController {
    
    private final ViewingRequestService viewingRequestService;
    
    @PostMapping
    public ResponseEntity<?> createViewingRequest(
            @Valid @RequestBody ViewingRequestDTO dto,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            String userId = authentication.getPrincipal().toString();
            UUID userUuid = UUID.fromString(userId);
            
            ViewingRequest created = viewingRequestService.createViewingRequest(userUuid, dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<ViewingRequest>> getUserViewingRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            String userId = authentication.getPrincipal().toString();
            UUID userUuid = UUID.fromString(userId);
            
            List<ViewingRequest> requests = viewingRequestService.getUserViewingRequests(userUuid);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ViewingRequest>> getPropertyViewingRequests(@PathVariable UUID propertyId) {
        try {
            List<ViewingRequest> requests = viewingRequestService.getPropertyViewingRequests(propertyId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
