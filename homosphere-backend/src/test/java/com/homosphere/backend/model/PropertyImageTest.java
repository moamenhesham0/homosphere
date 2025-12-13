package com.homosphere.backend.model;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PropertyImageTest {

    private PropertyImage propertyImage;

    @BeforeEach
    void setUp() {
        propertyImage = new PropertyImage();
    }

    @Test
    void testPropertyImageCreation() {
        // Arrange & Act
        UUID imageId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        String imageUrl = "https://example.com/image.jpg";

        propertyImage.setPropertyImageId(imageId);
        propertyImage.setImageUrl(imageUrl);
        propertyImage.setPropertyListingId(listingId);

        // Assert
        assertEquals(imageId, propertyImage.getPropertyImageId());
        assertEquals(imageUrl, propertyImage.getImageUrl());
        assertEquals(listingId, propertyImage.getPropertyListingId());
    }

    @Test
    void testPropertyImageWithNullUrl() {
        // Act
        propertyImage.setImageUrl(null);

        // Assert
        assertNull(propertyImage.getImageUrl());
    }

    @Test
    void testPropertyImageWithEmptyUrl() {
        // Act
        propertyImage.setImageUrl("");

        // Assert
        assertEquals("", propertyImage.getImageUrl());
    }

    @Test
    void testPropertyImageAllArgsConstructor() {
        // Arrange & Act
        UUID imageId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();
        PropertyImage newImage = new PropertyImage(
            imageId,
            "https://example.com/test.jpg",
            listingId
        );

        // Assert
        assertEquals(imageId, newImage.getPropertyImageId());
        assertEquals("https://example.com/test.jpg", newImage.getImageUrl());
        assertEquals(listingId, newImage.getPropertyListingId());
    }

    @Test
    void testPropertyImageNoArgsConstructor() {
        // Act
        PropertyImage newImage = new PropertyImage();

        // Assert
        assertNotNull(newImage);
        assertNull(newImage.getPropertyImageId());
        assertNull(newImage.getImageUrl());
        assertNull(newImage.getPropertyListingId());
    }

    @Test
    void testPropertyImageEquality() {
        // Arrange
        UUID imageId = UUID.randomUUID();
        UUID listingId = UUID.randomUUID();

        PropertyImage image1 = new PropertyImage();
        image1.setPropertyImageId(imageId);
        image1.setImageUrl("https://example.com/image.jpg");
        image1.setPropertyListingId(listingId);

        PropertyImage image2 = new PropertyImage();
        image2.setPropertyImageId(imageId);
        image2.setImageUrl("https://example.com/image.jpg");
        image2.setPropertyListingId(listingId);

        // Assert
        assertEquals(image1, image2);
        assertEquals(image1.hashCode(), image2.hashCode());
    }

    @Test
    void testPropertyImageToString() {
        // Arrange
        propertyImage.setPropertyImageId(UUID.randomUUID());
        propertyImage.setImageUrl("https://example.com/test.jpg");

        // Act
        String imageString = propertyImage.toString();

        // Assert
        assertNotNull(imageString);
        assertTrue(imageString.contains("PropertyImage"));
    }

    @Test
    void testPropertyImageWithDifferentUrls() {
        // Test various URL formats
        String cloudflareUrl = "https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/images-test.jpg";
        propertyImage.setImageUrl(cloudflareUrl);
        assertEquals(cloudflareUrl, propertyImage.getImageUrl());

        String localUrl = "http://localhost:8080/images/test.jpg";
        propertyImage.setImageUrl(localUrl);
        assertEquals(localUrl, propertyImage.getImageUrl());
    }

    @Test
    void testPropertyImageWithNullPropertyListingId() {
        // Act
        propertyImage.setPropertyListingId(null);

        // Assert
        assertNull(propertyImage.getPropertyListingId());
    }
}
