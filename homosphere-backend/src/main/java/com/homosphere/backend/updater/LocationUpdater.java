package com.homosphere.backend.updater;


import com.homosphere.backend.dto.LocationRequest;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LocationUpdater {
    private final LocationRepository locationRepository;

    public void update(Location location, LocationRequest locationRequest) {
        location.setLatitude(locationRequest.getLatitude());
        location.setLongitude(locationRequest.getLongitude());
        location.setCity(locationRequest.getCity());
        location.setState(locationRequest.getState());
        location.setStreet(locationRequest.getStreet());
        location.setZipCode(locationRequest.getZipCode());

        locationRepository.save(location);
    }
}
