package com.homosphere.backend.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.AuthResponse;
import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.ProfileDto;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.service.AuthService;
import com.homosphere.backend.service.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/google-signup")
    public ResponseEntity<AuthResponse> googleSignup(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody GoogleSignupRequest request) {
        
        try {
            // Extract token and get user ID
            String token = authHeader.replace("Bearer ", "");
            String userIdStr = jwtService.extractUserId(token);
            UUID userId = UUID.fromString(userIdStr);
            
            ProfileDto profileDto = authService.processGoogleSignup(userId, request);
            return ResponseEntity.ok(new AuthResponse("User synced successfully", profileDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse("Error syncing user: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> regularSignup(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SignupRequest request) {
        
        try {
            // Extract token and get user ID
            String token = authHeader.replace("Bearer ", "");
            String userIdStr = jwtService.extractUserId(token);
            UUID userId = UUID.fromString(userIdStr);
            
            ProfileDto profileDto = authService.processRegularSignup(userId, request);
            return ResponseEntity.ok(new AuthResponse("User registered successfully", profileDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new AuthResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse("Error registering user: " + e.getMessage()));
        }
    }
}
