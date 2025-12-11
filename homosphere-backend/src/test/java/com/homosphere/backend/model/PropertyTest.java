package com.homosphere.backend.model;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;

class PropertyTest {

    private Property property;
    private Location location;

    @BeforeEach
    void setUp() {
        property = new Property();

        location = new Location();
        location.setLocationId(UUID.randomUUID());
        location.setLatitude(40.7128);
        location.setLongitude(-74.0060);
        location.setCity("New York");
    }

    @Test
    void testPropertyCreation() {
        // Arrange & Act
        property.setPropertyId(UUID.randomUUID());
        property.setAreaInSquareMeters(150.0);
        property.setBedrooms(3);
        property.setBathrooms(2);
        property.setType(PropertyType.APARTMENT);
        property.setYearBuilt(Year.of(2020));
        property.setCondition(PropertyCondition.GOOD);
        property.setLocation(location);

        // Assert
        assertNotNull(property.getPropertyId());
        assertEquals(150.0, property.getAreaInSquareMeters());
        assertEquals(3, property.getBedrooms());
        assertEquals(2, property.getBathrooms());
        assertEquals(PropertyType.APARTMENT, property.getType());
        assertEquals(Year.of(2020), property.getYearBuilt());
        assertEquals(PropertyCondition.GOOD, property.getCondition());
        assertNotNull(property.getLocation());
    }

    @Test
    void testPropertyWithAmenities() {
        // Arrange
        List<Amenity> amenities = new ArrayList<>();
        Amenity amenity1 = new Amenity();
        amenity1.setName("Swimming Pool");
        amenity1.setType("recreation");
        amenities.add(amenity1);

        // Act
        property.setAmenities(amenities);

        // Assert
        assertNotNull(property.getAmenities());
        assertEquals(1, property.getAmenities().size());
        assertEquals("Swimming Pool", property.getAmenities().get(0).getName());
    }

    @Test
    void testPropertyWithNullAmenities() {
        // Act
        property.setAmenities(null);

        // Assert
        assertNull(property.getAmenities());
    }

    @Test
    void testPropertyTypes() {
        // Test all property types
        property.setType(PropertyType.APARTMENT);
        assertEquals(PropertyType.APARTMENT, property.getType());

        property.setType(PropertyType.VILLA);
        assertEquals(PropertyType.VILLA, property.getType());
    }

    @Test
    void testPropertyConditions() {
        // Test all property conditions
        property.setCondition(PropertyCondition.NEW);
        assertEquals(PropertyCondition.NEW, property.getCondition());

        property.setCondition(PropertyCondition.GOOD);
        assertEquals(PropertyCondition.GOOD, property.getCondition());

        property.setCondition(PropertyCondition.NEEDS_RENOVATION);
        assertEquals(PropertyCondition.NEEDS_RENOVATION, property.getCondition());
    }

    @Test
    void testPropertyEquality() {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        Property property1 = new Property();
        property1.setPropertyId(propertyId);
        property1.setAreaInSquareMeters(100.0);

        Property property2 = new Property();
        property2.setPropertyId(propertyId);
        property2.setAreaInSquareMeters(100.0);

        // Assert
        assertEquals(property1, property2);
        assertEquals(property1.hashCode(), property2.hashCode());
    }

    @Test
    void testPropertyWithLocation() {
        // Act
        property.setLocation(location);

        // Assert
        assertNotNull(property.getLocation());
        assertEquals(40.7128, property.getLocation().getLatitude());
        assertEquals(-74.0060, property.getLocation().getLongitude());
    }

    @Test
    void testPropertyAllArgsConstructor() {
        // Arrange & Act
        UUID propertyId = UUID.randomUUID();
        Property newProperty = new Property(
            propertyId,
            200.0,
            4,
            3,
            PropertyType.VILLA,
            Year.of(2021),
            new ArrayList<>(),
            location,
            PropertyCondition.GOOD
        );

        // Assert
        assertEquals(propertyId, newProperty.getPropertyId());
        assertEquals(200.0, newProperty.getAreaInSquareMeters());
        assertEquals(4, newProperty.getBedrooms());
        assertEquals(3, newProperty.getBathrooms());
        assertEquals(PropertyType.VILLA, newProperty.getType());
        assertEquals(Year.of(2021), newProperty.getYearBuilt());
        assertEquals(PropertyCondition.GOOD, newProperty.getCondition());
        assertNotNull(newProperty.getLocation());
    }

    @Test
    void testPropertyToString() {
        // Arrange
        property.setPropertyId(UUID.randomUUID());
        property.setAreaInSquareMeters(150.0);
        property.setType(PropertyType.APARTMENT);

        // Act
        String propertyString = property.toString();

        // Assert
        assertNotNull(propertyString);
        assertTrue(propertyString.contains("Property"));
    }
}
