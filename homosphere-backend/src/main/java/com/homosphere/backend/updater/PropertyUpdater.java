package com.homosphere.backend.updater;

import com.homosphere.backend.dto.property.request.PropertyRequest;
import com.homosphere.backend.mapper.AmenityMapper;
import com.homosphere.backend.mapper.LocationMapper;
import com.homosphere.backend.mapper.PropertyMapper;
import com.homosphere.backend.model.Location;
import com.homosphere.backend.model.property.Property;
import com.homosphere.backend.repository.PropertyListingRepository;
import com.homosphere.backend.repository.PropertyRepository;
import com.homosphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Context;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PropertyUpdater {
    private final PropertyRepository propertyRepository;
    private final LocationUpdater locationUpdater;
    private final AmenityMapper amenityMapper;
    private final PropertyMapper propertyMapper;
    private final LocationMapper locationMapper;

    public void update(Property property, PropertyRequest propertyRequest) {
        property.setYearBuilt(propertyRequest.getYearBuilt());
        property.setPropertyAreaSqFt(propertyRequest.getPropertyAreaSqFt());
        property.setLotAreaSqFt(propertyRequest.getLotAreaSqFt());
        property.setBedrooms(propertyRequest.getBedrooms());
        property.setBathrooms(propertyRequest.getBathrooms());
        property.setType(propertyRequest.getType());
        property.setAmenities(
                propertyRequest.getAmenities().stream()
                        .map(amenityMapper::toEntity)
                        .collect(Collectors.toList())
        );
        locationUpdater.update(property.getLocation(), propertyRequest.getLocation());
        property.setCondition(propertyRequest.getCondition());
        property.setYearBuilt(propertyRequest.getYearBuilt());


        propertyRepository.save(property);
    }

    public Property createWithRelationLinks(PropertyRequest propertyRequest) {
        Property property = propertyMapper.toEntity(propertyRequest);
        Location location = locationMapper.toEntity(propertyRequest.getLocation());
        property.setLocation(location);
        return property;
    }

}
