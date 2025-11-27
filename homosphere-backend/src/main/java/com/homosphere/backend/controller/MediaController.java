package com.homosphere.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.homosphere.backend.service.MediaService;

import lombok.RequiredArgsConstructor;

@RestController

@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/api/public/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = mediaService.uploadFile(file);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/api/public/photo")
    public ResponseEntity<String> getPhotoUrl(@RequestParam("id") String id) {
        String url = mediaService.getPhotoUrl(id);
        return ResponseEntity.ok(url);
    }

}