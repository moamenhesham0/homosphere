package com.homosphere.backend.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homosphere.backend.dto.AuthResponse;
import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.LoginResponse;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.dto.UserDto;
import com.homosphere.backend.service.AuthService;
import com.homosphere.backend.service.JwtService;

import jakarta.validation.Valid;
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
            @Valid @RequestBody GoogleSignupRequest request) {
        
        try {
            if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Invalid authorization header"));
            }
            
            // Extract token and get user ID
            String token = authHeader.replace("Bearer ", "");
            String userIdStr = jwtService.extractUserId(token);
            UUID userId = UUID.fromString(userIdStr);
            
            UserDto userDto = authService.processGoogleSignup(userId, request);
            return ResponseEntity.ok(new AuthResponse("User synced successfully", userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse("Error syncing user: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> regularSignup(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody SignupRequest request) {
        
        try {
            if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Invalid authorization header"));
            }
            
            // Extract token and get user ID
            String token = authHeader.replace("Bearer ", "");
            String userIdStr = jwtService.extractUserId(token);
            UUID userId = UUID.fromString(userIdStr);
            
            UserDto userDto = authService.processRegularSignup(userId, request);
            return ResponseEntity.ok(new AuthResponse("User registered successfully", userDto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new AuthResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse("Error registering user: " + e.getMessage()));
        }
    }
    
    /**
     * Login endpoint - verifies Supabase token and returns user data
     * This endpoint is called after Supabase authentication to sync with backend
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Invalid authorization header", null));
            }
            
            // Extract and validate Supabase JWT token
            String token = authHeader.replace("Bearer ", "");
            
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Token expired or invalid", null));
            }
            
            String userIdStr = jwtService.extractUserId(token);
            UUID userId = UUID.fromString(userIdStr);
            
            // Get user from backend
            UserDto userDto = authService.getUserById(userId);
            
            return ResponseEntity.ok(new LoginResponse("Login successful", token, userDto));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new LoginResponse("User not found in backend. Please complete signup.", null));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("Invalid credentials", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse("Error during login: " + e.getMessage(), null));
        }
    }
}
