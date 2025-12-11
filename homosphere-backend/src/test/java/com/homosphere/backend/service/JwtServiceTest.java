package com.homosphere.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

class JwtServiceTest {

    private JwtService jwtService;
    private String secretKey;
    private Key signingKey;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        secretKey = "your-very-long-secret-key-for-testing-purposes-must-be-at-least-256-bits";
        signingKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
    }

    @Test
    void extractUserId_WithValidToken_ReturnsUserId() {
        String userId = "123e4567-e89b-12d3-a456-426614174000";
        String token = createToken(userId, new HashMap<>());

        String result = jwtService.extractUserId(token);

        assertEquals(userId, result);
    }

    @Test
    void extractUserId_TokenWithoutSubject_ThrowsException() {
        Map<String, Object> claims = new HashMap<>();
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(signingKey)
                .compact();

        assertThrows(IllegalArgumentException.class, () -> jwtService.extractUserId(token));
    }

    @Test
    void extractUserEmail_ValidToken_ReturnsEmail() {
        String userId = "user-id";
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("email", "test@example.com");
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_metadata", metadata);
        
        String token = createToken(userId, claims);

        String result = jwtService.extractUserEmail(token);

        assertEquals("test@example.com", result);
    }

    @Test
    void extractUserEmail_NoMetadata_ThrowsException() {
        String userId = "user-id";
        String token = createToken(userId, new HashMap<>());

        assertThrows(IllegalArgumentException.class, () -> jwtService.extractUserEmail(token));
    }

    @Test
    void extractUserRole_ValidToken_ReturnsRole() {
        String userId = "user-id";
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("role", "ADMIN");
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_metadata", metadata);
        
        String token = createToken(userId, claims);

        String result = jwtService.extractUserRole(token);

        assertEquals("ADMIN", result);
    }

    @Test
    void extractUserRole_NoMetadata_ThrowsException() {
        String userId = "user-id";
        String token = createToken(userId, new HashMap<>());

        assertThrows(IllegalArgumentException.class, () -> jwtService.extractUserRole(token));
    }

    private String createToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(signingKey)
                .compact();
    }
}
