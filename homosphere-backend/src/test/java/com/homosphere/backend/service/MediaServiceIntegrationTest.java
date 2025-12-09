package com.homosphere.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest
class MediaServiceIntegrationTest {

    @Autowired
    private MediaService mediaService;

    @Test
    void uploadFile_WithRealS3Client_ShouldUploadToCloudflare() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "testalive.txt",
            "text/plain",
            "Hi my name is muhannd".getBytes()
        );

        // Act
        String result = mediaService.uploadFile(file);

        // Assert
        System.out.println("Uploaded file key: " + result);
        assertNotNull(result);
        assertTrue(result.startsWith("documents-"), "Expected to start with 'documents-' but got: " + result);
        assertTrue(result.endsWith("testalive.txt"), "Expected to end with 'testAlive.txt' but got: " + result);
    }
}
