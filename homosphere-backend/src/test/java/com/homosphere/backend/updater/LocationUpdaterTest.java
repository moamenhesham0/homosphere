package com.homosphere.backend.updater;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.homosphere.backend.dto.LocationRequest;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.repository.LocationRepository;

class LocationUpdaterTest {
    @Mock LocationRepository locationRepository;
    @InjectMocks LocationUpdater locationUpdater;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void update_UpdatesAllFieldsAndSaves() {
        Location location = new Location();
        LocationRequest req = new LocationRequest();
        req.setLatitude(1.1);
        req.setLongitude(2.2);
        req.setCity("C");
        req.setState("S");
        req.setStreet("St");
        req.setZipCode("Z");
        when(locationRepository.save(any())).thenReturn(location);
        locationUpdater.update(location, req);
        assertEquals(1.1, location.getLatitude());
        assertEquals(2.2, location.getLongitude());
        assertEquals("C", location.getCity());
        assertEquals("S", location.getState());
        assertEquals("St", location.getStreet());
        assertEquals("Z", location.getZipCode());
    }
}
