package com.homosphere.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.homosphere.backend.enums.PropertyListingStatus;

class PropertyListingTest {

    private PropertyListing propertyListing;
    private User seller;
    private User broker;
    private Property property;
    private PropertyImage bannerImage;

    @BeforeEach
    void setUp() {
        propertyListing = new PropertyListing();

        seller = new User();
        seller.setId(UUID.randomUUID());
        seller.setEmail("seller@test.com");

        broker = new User();
        broker.setId(UUID.randomUUID());
        broker.setEmail("broker@test.com");

        property = new Property();
        property.setPropertyId(UUID.randomUUID());

        bannerImage = new PropertyImage();
        bannerImage.setPropertyImageId(UUID.randomUUID());
        bannerImage.setImageUrl("https://example.com/banner.jpg");
    }

    @Test
    void testPropertyListingCreation() {
        // Arrange & Act
        UUID listingId = UUID.randomUUID();
        propertyListing.setPropertyListingId(listingId);
        propertyListing.setTitle("Beautiful House");
        propertyListing.setDescription("A beautiful house with a garden");
        propertyListing.setPrice(500000.0);
        propertyListing.setSeller(seller);
        propertyListing.setProperty(property);
        propertyListing.setPropertyListingStatus(PropertyListingStatus.PUBLISHED);
        propertyListing.setViews(0);
        propertyListing.setPublicationDate(LocalDateTime.now());
        propertyListing.setLastUpdatedDate(LocalDateTime.now());

        // Assert
        assertEquals(listingId, propertyListing.getPropertyListingId());
        assertEquals("Beautiful House", propertyListing.getTitle());
        assertEquals("A beautiful house with a garden", propertyListing.getDescription());
        assertEquals(500000.0, propertyListing.getPrice());
        assertNotNull(propertyListing.getSeller());
        assertNotNull(propertyListing.getProperty());
        assertEquals(PropertyListingStatus.PUBLISHED, propertyListing.getPropertyListingStatus());
        assertEquals(0, propertyListing.getViews());
        assertNotNull(propertyListing.getPublicationDate());
        assertNotNull(propertyListing.getLastUpdatedDate());
    }

    @Test
    void testPropertyListingWithBroker() {
        // Act
        propertyListing.setBrooker(broker);

        // Assert
        assertNotNull(propertyListing.getBrooker());
        assertEquals(broker.getEmail(), propertyListing.getBrooker().getEmail());
    }

    @Test
    void testPropertyListingWithBannerImage() {
        // Act
        propertyListing.setBannerImage(bannerImage);

        // Assert
        assertNotNull(propertyListing.getBannerImage());
        assertEquals("https://example.com/banner.jpg", propertyListing.getBannerImage().getImageUrl());
    }

    @Test
    void testPropertyListingWithPropertyImages() {
        // Arrange
        List<PropertyImage> images = new ArrayList<>();
        PropertyImage image1 = new PropertyImage();
        image1.setPropertyImageId(UUID.randomUUID());
        image1.setImageUrl("https://example.com/image1.jpg");
        images.add(image1);

        PropertyImage image2 = new PropertyImage();
        image2.setPropertyImageId(UUID.randomUUID());
        image2.setImageUrl("https://example.com/image2.jpg");
        images.add(image2);

        // Act
        propertyListing.setPropertyImages(images);

        // Assert
        assertNotNull(propertyListing.getPropertyImages());
        assertEquals(2, propertyListing.getPropertyImages().size());
    }

    @Test
    void testPropertyListingStatuses() {
        // Test all statuses
        propertyListing.setPropertyListingStatus(PropertyListingStatus.PENDING);
        assertEquals(PropertyListingStatus.PENDING, propertyListing.getPropertyListingStatus());

        propertyListing.setPropertyListingStatus(PropertyListingStatus.PUBLISHED);
        assertEquals(PropertyListingStatus.PUBLISHED, propertyListing.getPropertyListingStatus());

        propertyListing.setPropertyListingStatus(PropertyListingStatus.DRAFT);
        assertEquals(PropertyListingStatus.DRAFT, propertyListing.getPropertyListingStatus());

        propertyListing.setPropertyListingStatus(PropertyListingStatus.UNLISTED);
        assertEquals(PropertyListingStatus.UNLISTED, propertyListing.getPropertyListingStatus());
    }

    @Test
    void testPropertyListingWithSavedByUsers() {
        // Arrange
        List<User> savedByUsers = new ArrayList<>();
        User user1 = new User();
        user1.setId(UUID.randomUUID());
        savedByUsers.add(user1);

        User user2 = new User();
        user2.setId(UUID.randomUUID());
        savedByUsers.add(user2);

        // Act
        propertyListing.setSavedByUsers(savedByUsers);

        // Assert
        assertNotNull(propertyListing.getSavedByUsers());
        assertEquals(2, propertyListing.getSavedByUsers().size());
    }

    @Test
    void testPropertyListingViewsIncrement() {
        // Arrange
        propertyListing.setViews(10);

        // Act
        propertyListing.setViews(propertyListing.getViews() + 1);

        // Assert
        assertEquals(11, propertyListing.getViews());
    }

    @Test
    void testPropertyListingDates() {
        // Arrange
        LocalDateTime publicationDate = LocalDateTime.now().minusDays(5);
        LocalDateTime lastUpdatedDate = LocalDateTime.now();

        // Act
        propertyListing.setPublicationDate(publicationDate);
        propertyListing.setLastUpdatedDate(lastUpdatedDate);

        // Assert
        assertNotNull(propertyListing.getPublicationDate());
        assertNotNull(propertyListing.getLastUpdatedDate());
        assertTrue(propertyListing.getLastUpdatedDate().isAfter(propertyListing.getPublicationDate()));
    }

    @Test
    void testPropertyListingAllArgsConstructor() {
        // Arrange & Act
        UUID listingId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        PropertyListing newListing = new PropertyListing(
            listingId,
            "Test Title",
            "Test Description",
            300000.0,
            seller,
            broker,
            bannerImage,
            new ArrayList<>(),
            property,
            100,
            PropertyListingStatus.PUBLISHED,
            now,
            now,
            new ArrayList<>()
        );

        // Assert
        assertEquals(listingId, newListing.getPropertyListingId());
        assertEquals("Test Title", newListing.getTitle());
        assertEquals("Test Description", newListing.getDescription());
        assertEquals(300000.0, newListing.getPrice());
        assertNotNull(newListing.getSeller());
        assertNotNull(newListing.getBrooker());
        assertNotNull(newListing.getBannerImage());
        assertNotNull(newListing.getProperty());
        assertEquals(100, newListing.getViews());
        assertEquals(PropertyListingStatus.PUBLISHED, newListing.getPropertyListingStatus());
    }

    @Test
    void testPropertyListingEquality() {
        // Arrange
        UUID listingId = UUID.randomUUID();
        PropertyListing listing1 = new PropertyListing();
        listing1.setPropertyListingId(listingId);
        listing1.setTitle("Test");

        PropertyListing listing2 = new PropertyListing();
        listing2.setPropertyListingId(listingId);
        listing2.setTitle("Test");

        // Assert
        assertEquals(listing1, listing2);
        assertEquals(listing1.hashCode(), listing2.hashCode());
    }

    @Test
    void testPropertyListingToString() {
        // Arrange
        propertyListing.setPropertyListingId(UUID.randomUUID());
        propertyListing.setTitle("Test Property");

        // Act
        String listingString = propertyListing.toString();

        // Assert
        assertNotNull(listingString);
        assertTrue(listingString.contains("PropertyListing"));
    }

    @Test
    void testPropertyListingNullBroker() {
        // Act
        propertyListing.setBrooker(null);

        // Assert
        assertNull(propertyListing.getBrooker());
    }

    @Test
    void testPropertyListingEmptyPropertyImages() {
        // Act
        propertyListing.setPropertyImages(new ArrayList<>());

        // Assert
        assertNotNull(propertyListing.getPropertyImages());
        assertTrue(propertyListing.getPropertyImages().isEmpty());
    }
}
