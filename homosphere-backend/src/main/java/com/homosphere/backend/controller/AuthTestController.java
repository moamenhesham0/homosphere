package com.homosphere.backend.controller;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
public class AuthTestController {

    @Value("${supabase.jwt.secret}")
    private String secretKey;

    /**
     * Generate a test JWT token for development/testing
     * This endpoint is for testing only - remove in production
     */
    @PostMapping("/api/auth/test-token")
    public ResponseEntity<Map<String, String>> generateTestToken(@RequestBody Map<String, Object> request) {
        
        String userId = request.getOrDefault("userId", "1").toString();
        String email = request.getOrDefault("email", "test@example.com").toString();
        String role = request.getOrDefault("role", "USER").toString();
        
        // Create user_metadata
        Map<String, Object> userMetadata = new HashMap<>();
        userMetadata.put("Email", email);
        userMetadata.put("Role", role);
        
        // Generate token
        String token = Jwts.builder()
                .setSubject(userId)
                .claim("user_metadata", userMetadata)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))) //sign the token with the secret key
                .compact();
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", userId);
        response.put("email", email);
        response.put("role", role);
        
        return ResponseEntity.ok(response);
    }

    /**
    * test validation
    */
    @GetMapping("api/user/test-auth")
    public ResponseEntity<Map<String, String>> testEndPoint(@RequestBody Map<String, Object> request){
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "User successfully Authenticated");

        return ResponseEntity.ok(response);
    }
}
