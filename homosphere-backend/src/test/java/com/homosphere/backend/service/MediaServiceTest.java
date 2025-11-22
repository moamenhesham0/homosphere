package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock
    private S3Client s3Client;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private MediaService mediaService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(mediaService, "bucket", "test-bucket");
    }

    @Test
    void uploadFile_WithValidTextFile_ShouldReturnKey() throws IOException {
        // Arrange
        String filename = "mytest.txt";
        String contentType = "text/plain";
        byte[] fileContent = "Hello World".getBytes();

        when(multipartFile.getOriginalFilename()).thenReturn(filename);
        when(multipartFile.getContentType()).thenReturn(contentType);
        when(multipartFile.getBytes()).thenReturn(fileContent);
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
            .thenReturn(PutObjectResponse.builder().build());

        // Act
        String result = mediaService.uploadFile(multipartFile);

        // Assert
        assertNotNull(result);
        assertTrue(result.startsWith("documents-"));
        assertTrue(result.endsWith(filename));
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }
}
