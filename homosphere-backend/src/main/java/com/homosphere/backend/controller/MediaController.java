package com.homosphere.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.homosphere.backend.service.MediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required and cannot be empty");
        }
        
        // Validate file size (e.g., max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size must not exceed 5MB");
        }
        
        // Validate file type (images only)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }
        
        String url = mediaService.uploadFile(file);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/photo")
    public ResponseEntity<String> getPhotoUrl(@RequestParam("id") String id) {
        if (id == null || id.isBlank()) {
            return ResponseEntity.badRequest().body("Photo ID is required");
        }
        String url = mediaService.getPhotoUrl(id);
        return ResponseEntity.ok(url);
    }

}