package com.homosphere.backend.model;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.homosphere.backend.model.property.PropertyImage;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.PropertyListingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

class PropertyImageTest {

    private PropertyImage propertyImage;

    @Mock
    private PropertyListingRepository propertyListingRepository;

    @BeforeEach
    void setUp() {
        propertyImage = new PropertyImage();
    }

    @Test
    void testPropertyImageCreation() {
        // Arrange & Act
        UUID imageId = UUID.randomUUID();
        PropertyListing propertyListing = new PropertyListing();
        String imageUrl = "https://example.com/image.jpg";

        propertyImage.setPropertyImageId(imageId);
        propertyImage.setImageUrl(imageUrl);
        propertyImage.setPropertyListing(propertyListing);

        // Assert
        assertEquals(imageId, propertyImage.getPropertyImageId());
        assertEquals(imageUrl, propertyImage.getImageUrl());
        assertEquals(propertyListing, propertyImage.getPropertyListing());
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
    void testPropertyImageEquality() {
        // Arrange
        UUID imageId = UUID.randomUUID();
        PropertyListing propertyListing = new PropertyListing();

        PropertyImage image1 = new PropertyImage();
        image1.setPropertyImageId(imageId);
        image1.setImageUrl("https://example.com/image.jpg");
        image1.setPropertyListing(propertyListing);

        PropertyImage image2 = new PropertyImage();
        image2.setPropertyImageId(imageId);
        image2.setImageUrl("https://example.com/image.jpg");
        image2.setPropertyListing(propertyListing);

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
        propertyImage.setPropertyListing(null);

        // Assert
        assertNull(propertyImage.getPropertyListing());
    }
}
