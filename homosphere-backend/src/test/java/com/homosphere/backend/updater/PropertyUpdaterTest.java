package com.homosphere.backend.updater;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.property.request.PropertyRequest;
import com.homosphere.backend.mapper.AmenityMapper;
import com.homosphere.backend.mapper.LocationMapper;
import com.homosphere.backend.mapper.PropertyMapper;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.repository.PropertyRepository;

class PropertyUpdaterTest {
    @Mock PropertyRepository propertyRepository;
    @Mock LocationUpdater locationUpdater;
    @Mock AmenityMapper amenityMapper;
    @Mock PropertyMapper propertyMapper;
    @Mock LocationMapper locationMapper;
    @InjectMocks PropertyUpdater propertyUpdater;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void update_UpdatesAllFields() {
        Property property = new Property();
        PropertyRequest req = new PropertyRequest();
        req.setYearBuilt(java.time.Year.of(2000));
        req.setPropertyAreaSqFt(100.0);
        req.setLotAreaSqFt(200.0);
        req.setBedrooms(2);
        req.setBathrooms(1);
        req.setType(null);
        req.setAmenities(new java.util.ArrayList<>());
        req.setLocation(new com.homosphere.backend.dto.LocationRequest());
        req.setCondition(null);
        doNothing().when(locationUpdater).update(any(), any());
        when(propertyRepository.save(any())).thenReturn(property);
        propertyUpdater.update(property, req);
        assertEquals(100.0, property.getPropertyAreaSqFt());
        assertEquals(200.0, property.getLotAreaSqFt());
        assertEquals(2, property.getBedrooms());
        assertEquals(1, property.getBathrooms());
        assertEquals(java.time.Year.of(2000), property.getYearBuilt());
    }

    @Test
    void createWithRelationLinks_ReturnsProperty() {
        PropertyRequest req = new PropertyRequest();
        when(propertyMapper.toEntity(any())).thenReturn(new Property());
        when(locationMapper.toEntity(any())).thenReturn(new Location());
        Property result = propertyUpdater.createWithRelationLinks(req);
        assertNotNull(result);
        assertNotNull(result.getLocation());
    }

    // Removed test for non-existent updateProperty method
}
