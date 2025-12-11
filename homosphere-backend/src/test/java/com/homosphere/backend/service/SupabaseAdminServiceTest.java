package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
class SupabaseAdminServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SupabaseAdminService supabaseAdminService;

    private static final String SUPABASE_URL = "https://test.supabase.co";
    private static final String SERVICE_ROLE_KEY = "test-service-role-key";
    private static final String USER_ID = "550e8400-e29b-41d4-a716-446655440000";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(supabaseAdminService, "supabaseUrl", SUPABASE_URL);
        ReflectionTestUtils.setField(supabaseAdminService, "serviceRoleKey", SERVICE_ROLE_KEY);
    }

    // ========== Test confirmAdminEmail ==========

    @Test
    void testConfirmAdminEmail_Success() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Success", HttpStatus.OK);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.confirmAdminEmail(USER_ID);

        // Assert
        assertTrue(result);
        verify(restTemplate).exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        );
    }

    @Test
    void testConfirmAdminEmail_FailureWithNonOkStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.confirmAdminEmail(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testConfirmAdminEmail_ExceptionThrown() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        )).thenThrow(new RestClientException("Connection error"));

        // Act
        boolean result = supabaseAdminService.confirmAdminEmail(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testConfirmAdminEmail_NullResponse() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(null);

        // Act
        boolean result = supabaseAdminService.confirmAdminEmail(USER_ID);

        // Assert
        assertFalse(result);
    }

    // ========== Test deleteUser ==========

    @Test
    void testDeleteUser_SuccessWithOkStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Deleted", HttpStatus.OK);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertTrue(result);
        verify(restTemplate).exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        );
    }

    @Test
    void testDeleteUser_SuccessWithNoContentStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>(HttpStatus.NO_CONTENT);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertTrue(result);
    }

    @Test
    void testDeleteUser_FailureWithBadRequestStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testDeleteUser_ExceptionThrown() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenThrow(new RestClientException("Network error"));

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testDeleteUser_NullResponse() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(null);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testDeleteUser_UnauthorizedStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testDeleteUser_NotFoundStatus() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.DELETE),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.deleteUser(USER_ID);

        // Assert
        assertFalse(result);
    }

    @Test
    void testConfirmAdminEmail_InternalServerError() {
        // Arrange
        String url = SUPABASE_URL + "/auth/v1/admin/users/" + USER_ID;
        ResponseEntity<String> mockResponse = new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);

        when(restTemplate.exchange(
            eq(url),
            eq(HttpMethod.PUT),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(mockResponse);

        // Act
        boolean result = supabaseAdminService.confirmAdminEmail(USER_ID);

        // Assert
        assertFalse(result);
    }
}
