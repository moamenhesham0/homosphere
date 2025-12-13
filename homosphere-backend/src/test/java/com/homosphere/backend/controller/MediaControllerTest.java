package com.homosphere.backend.controller;

import java.util.Map;

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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import com.homosphere.backend.service.MediaService;

@ExtendWith(MockitoExtension.class)
class MediaControllerTest {

    @Mock
    private MediaService mediaService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private MediaController mediaController;

    private MultipartFile validImageFile;
    private MultipartFile largeFile;
    private MultipartFile nonImageFile;

    @BeforeEach
    void setUp() {
        validImageFile = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        // Create a file larger than 10MB
        byte[] largeContent = new byte[11 * 1024 * 1024];
        largeFile = new MockMultipartFile(
            "file",
            "large.jpg",
            "image/jpeg",
            largeContent
        );

        nonImageFile = new MockMultipartFile(
            "file",
            "test.pdf",
            "application/pdf",
            "test pdf content".getBytes()
        );
    }

    @Test
    void uploadFile_WithValidFile_ReturnsUrl() {
        String expectedUrl = "https://example.com/uploaded-file.jpg";
        when(authentication.isAuthenticated()).thenReturn(true);
        when(mediaService.uploadFile(any(MultipartFile.class))).thenReturn(expectedUrl);

        ResponseEntity<?> response = mediaController.uploadFile(validImageFile, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(expectedUrl, body.get("url"));
        verify(mediaService, times(1)).uploadFile(validImageFile);
    }

    @Test
    void uploadFile_WithUnauthenticated_ReturnsUnauthorized() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = mediaController.uploadFile(validImageFile, authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Unauthorized", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithNullAuthentication_ReturnsUnauthorized() {
        ResponseEntity<?> response = mediaController.uploadFile(validImageFile, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithNullFile_ReturnsBadRequest() {
        when(authentication.isAuthenticated()).thenReturn(true);

        ResponseEntity<?> response = mediaController.uploadFile(null, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("File is required and cannot be empty", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithEmptyFile_ReturnsBadRequest() {
        MultipartFile emptyFile = new MockMultipartFile(
            "file",
            "empty.jpg",
            "image/jpeg",
            new byte[0]
        );
        when(authentication.isAuthenticated()).thenReturn(true);

        ResponseEntity<?> response = mediaController.uploadFile(emptyFile, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("File is required and cannot be empty", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithLargeFile_ReturnsBadRequest() {
        when(authentication.isAuthenticated()).thenReturn(true);

        ResponseEntity<?> response = mediaController.uploadFile(largeFile, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("File size must not exceed 10MB", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithNonImageFile_ReturnsBadRequest() {
        when(authentication.isAuthenticated()).thenReturn(true);

        ResponseEntity<?> response = mediaController.uploadFile(nonImageFile, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Only image files are allowed", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

    @Test
    void uploadFile_WithNullContentType_ReturnsBadRequest() {
        MultipartFile fileWithNullContentType = new MockMultipartFile(
            "file",
            "test.jpg",
            null,
            "test content".getBytes()
        );
        when(authentication.isAuthenticated()).thenReturn(true);

        ResponseEntity<?> response = mediaController.uploadFile(fileWithNullContentType, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Only image files are allowed", body.get("message"));
        verify(mediaService, never()).uploadFile(any());
    }

}
