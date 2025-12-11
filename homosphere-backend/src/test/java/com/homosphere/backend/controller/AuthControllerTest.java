package com.homosphere.backend.controller;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.homosphere.backend.dto.AuthResponse;
import com.homosphere.backend.dto.GoogleSignupRequest;
import com.homosphere.backend.dto.SignupRequest;
import com.homosphere.backend.dto.UserDto;
import com.homosphere.backend.service.AuthService;
import com.homosphere.backend.service.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private String validToken;
    private String authHeader;
    private UUID userId;
    private GoogleSignupRequest googleRequest;
    private SignupRequest signupRequest;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        validToken = "valid.jwt.token";
        authHeader = "Bearer " + validToken;

        googleRequest = new GoogleSignupRequest();
        googleRequest.setEmail("test@gmail.com");
        googleRequest.setFirstName("Test");
        googleRequest.setLastName("User");

        signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        userDto = new UserDto();
        userDto.setEmail("test@example.com");
    }

    @Test
    void googleSignup_WithValidToken_ReturnsSuccess() {
        when(jwtService.extractUserId(validToken)).thenReturn(userId.toString());
        when(authService.processGoogleSignup(userId, googleRequest)).thenReturn(userDto);

        ResponseEntity<AuthResponse> response = authController.googleSignup(authHeader, googleRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("User synced successfully", response.getBody().getMessage());
        verify(authService, times(1)).processGoogleSignup(userId, googleRequest);
    }

    @Test
    void googleSignup_WithNullAuthHeader_ReturnsUnauthorized() {
        ResponseEntity<AuthResponse> response = authController.googleSignup(null, googleRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid authorization header", response.getBody().getMessage());
        verify(authService, never()).processGoogleSignup(any(), any());
    }

    @Test
    void googleSignup_WithBlankAuthHeader_ReturnsUnauthorized() {
        ResponseEntity<AuthResponse> response = authController.googleSignup("", googleRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(authService, never()).processGoogleSignup(any(), any());
    }

    @Test
    void googleSignup_WithoutBearerPrefix_ReturnsUnauthorized() {
        ResponseEntity<AuthResponse> response = authController.googleSignup("InvalidToken", googleRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(authService, never()).processGoogleSignup(any(), any());
    }

    @Test
    void googleSignup_WithServiceException_ReturnsInternalServerError() {
        when(jwtService.extractUserId(validToken)).thenReturn(userId.toString());
        when(authService.processGoogleSignup(userId, googleRequest))
            .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<AuthResponse> response = authController.googleSignup(authHeader, googleRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().getMessage().contains("Error syncing user"));
    }

    @Test
    void regularSignup_WithValidToken_ReturnsSuccess() {
        when(jwtService.extractUserId(validToken)).thenReturn(userId.toString());
        when(authService.processRegularSignup(userId, signupRequest)).thenReturn(userDto);

        ResponseEntity<AuthResponse> response = authController.regularSignup(authHeader, signupRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("User registered successfully", response.getBody().getMessage());
        verify(authService, times(1)).processRegularSignup(userId, signupRequest);
    }

    @Test
    void regularSignup_WithNullAuthHeader_ReturnsUnauthorized() {
        ResponseEntity<AuthResponse> response = authController.regularSignup(null, signupRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(authService, never()).processRegularSignup(any(), any());
    }

    @Test
    void regularSignup_WithIllegalArgument_ReturnsConflict() {
        when(jwtService.extractUserId(validToken)).thenReturn(userId.toString());
        when(authService.processRegularSignup(userId, signupRequest))
            .thenThrow(new IllegalArgumentException("User already exists"));

        ResponseEntity<AuthResponse> response = authController.regularSignup(authHeader, signupRequest);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("User already exists", response.getBody().getMessage());
    }

    @Test
    void regularSignup_WithServiceException_ReturnsInternalServerError() {
        when(jwtService.extractUserId(validToken)).thenReturn(userId.toString());
        when(authService.processRegularSignup(userId, signupRequest))
            .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<AuthResponse> response = authController.regularSignup(authHeader, signupRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().getMessage().contains("Error registering user"));
    }
}
