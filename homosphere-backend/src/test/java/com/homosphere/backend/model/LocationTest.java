package com.homosphere.backend.model;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LocationTest {

    private Location location;

    @BeforeEach
    void setUp() {
        location = new Location();
    }

    @Test
    void testLocationCreation() {
        // Arrange & Act
        UUID locationId = UUID.randomUUID();
        location.setLocationId(locationId);
        location.setLatitude(40.7128);
        location.setLongitude(-74.0060);
        location.setStreet("123 Main St");
        location.setCity("New York");
        location.setState("NY");
        location.setZipCode("10001");

        // Assert
        assertEquals(locationId, location.getLocationId());
        assertEquals(40.7128, location.getLatitude());
        assertEquals(-74.0060, location.getLongitude());
        assertEquals("123 Main St", location.getStreet());
        assertEquals("New York", location.getCity());
        assertEquals("NY", location.getState());
        assertEquals("10001", location.getZipCode());
    }

    @Test
    void testLocationWithNullStreet() {
        // Act
        location.setStreet(null);

        // Assert
        assertNull(location.getStreet());
    }

    @Test
    void testLocationWithNullZipCode() {
        // Act
        location.setZipCode(null);

        // Assert
        assertNull(location.getZipCode());
    }

    @Test
    void testLocationCoordinates() {
        // Test various coordinate values
        location.setLatitude(0.0);
        location.setLongitude(0.0);
        assertEquals(0.0, location.getLatitude());
        assertEquals(0.0, location.getLongitude());

        location.setLatitude(90.0);
        location.setLongitude(180.0);
        assertEquals(90.0, location.getLatitude());
        assertEquals(180.0, location.getLongitude());

        location.setLatitude(-90.0);
        location.setLongitude(-180.0);
        assertEquals(-90.0, location.getLatitude());
        assertEquals(-180.0, location.getLongitude());
    }

    @Test
    void testLocationAllArgsConstructor() {
        // Arrange & Act
        UUID locationId = UUID.randomUUID();
        Location newLocation = new Location(
            locationId,
            "1-1-1 Shibuya",
            "Tokyo",
            "Tokyo",
            "150-0002",
            35.6762,
            139.6503
        );

        // Assert
        assertEquals(locationId, newLocation.getLocationId());
        assertEquals(35.6762, newLocation.getLatitude());
        assertEquals(139.6503, newLocation.getLongitude());
        assertEquals("1-1-1 Shibuya", newLocation.getStreet());
        assertEquals("Tokyo", newLocation.getCity());
        assertEquals("Tokyo", newLocation.getState());
        assertEquals("150-0002", newLocation.getZipCode());
    }

    @Test
    void testLocationNoArgsConstructor() {
        // Act
        Location newLocation = new Location();

        // Assert
        assertNotNull(newLocation);
        assertNull(newLocation.getLocationId());
        assertNull(newLocation.getLatitude());
        assertNull(newLocation.getLongitude());
        assertNull(newLocation.getStreet());
        assertNull(newLocation.getCity());
        assertNull(newLocation.getState());
        assertNull(newLocation.getZipCode());
    }

    @Test
    void testLocationEquality() {
        // Arrange
        UUID locationId = UUID.randomUUID();
        Location location1 = new Location();
        location1.setLocationId(locationId);
        location1.setCity("New York");

        Location location2 = new Location();
        location2.setLocationId(locationId);
        location2.setCity("New York");

        // Assert
        assertEquals(location1, location2);
        assertEquals(location1.hashCode(), location2.hashCode());
    }

    @Test
    void testLocationToString() {
        // Arrange
        location.setLocationId(UUID.randomUUID());
        location.setCity("New York");
        location.setState("NY");

        // Act
        String locationString = location.toString();

        // Assert
        assertNotNull(locationString);
        assertTrue(locationString.contains("Location"));
    }

    @Test
    void testLocationWithPartialData() {
        // Act - Set only essential fields
        location.setLatitude(51.5074);
        location.setLongitude(-0.1278);
        location.setCity("London");
        location.setState("England");

        // Assert
        assertEquals(51.5074, location.getLatitude());
        assertEquals(-0.1278, location.getLongitude());
        assertEquals("London", location.getCity());
        assertEquals("England", location.getState());
        assertNull(location.getStreet());
        assertNull(location.getZipCode());
    }

    @Test
    void testLocationWithInternationalAddresses() {
        // Test with various international formats
        location.setStreet("10 Downing Street");
        location.setCity("London");
        location.setState("England");
        location.setZipCode("SW1A 2AA");

        assertEquals("10 Downing Street", location.getStreet());
        assertEquals("London", location.getCity());
        assertEquals("England", location.getState());
        assertEquals("SW1A 2AA", location.getZipCode());
    }
}
