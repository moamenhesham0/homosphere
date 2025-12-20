package com.homosphere.backend.mapper;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.homosphere.backend.model.property.PropertyListing;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.dto.property.response.PropertyImageResponse;
import com.homosphere.backend.model.property.PropertyImage;

@SpringBootTest
class PropertyImageMapperTest {

    @Autowired
    private PropertyImageMapper propertyImageMapper;

    private PropertyImage propertyImage;
    private PropertyImageRequest propertyImageRequest;

    @BeforeEach
    void setUp() {
        // Setup PropertyImage entity
        propertyImage = new PropertyImage();
        propertyImage.setPropertyImageId(UUID.randomUUID());
        propertyImage.setImageUrl("https://example.com/image.jpg");
        propertyImage.setPropertyListing(new PropertyListing());

        // Setup PropertyImageRequest DTO
        propertyImageRequest = new PropertyImageRequest();
        propertyImageRequest.setImageUrl("https://example.com/new-image.jpg");
    }

    @Test
    void testToEntity() {
        // Act
        PropertyImage result = propertyImageMapper.toEntity(propertyImageRequest);

        // Assert
        assertNotNull(result);
        assertEquals(propertyImageRequest.getImageUrl(), result.getImageUrl());
    }

    @Test
    void testToEntityWithNull() {
        // Act
        PropertyImage result = propertyImageMapper.toEntity(null);

        // Assert
        assertNull(result);
    }

    @Test
    void testToResponse() {
        // Act
        PropertyImageResponse result = propertyImageMapper.toResponse(propertyImage);

        // Assert
        assertNotNull(result);
        assertEquals(propertyImage.getPropertyImageId(), result.getPropertyImageId());
        assertEquals(propertyImage.getImageUrl(), result.getImageUrl());
    }

    @Test
    void testToResponseWithNull() {
        // Act
        PropertyImageResponse result = propertyImageMapper.toResponse(null);

        // Assert
        assertNull(result);
    }

    @Test
    void testMappingPreservesData() {
        // Act
        PropertyImage entity = propertyImageMapper.toEntity(propertyImageRequest);
        PropertyImageResponse response = propertyImageMapper.toResponse(propertyImage);

        // Assert
        assertEquals(propertyImageRequest.getImageUrl(), entity.getImageUrl());
        assertEquals(propertyImage.getImageUrl(), response.getImageUrl());
    }
}
