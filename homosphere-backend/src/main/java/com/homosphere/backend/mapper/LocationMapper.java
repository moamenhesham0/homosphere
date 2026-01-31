package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.LocationRequest;
import com.homosphere.backend.dto.LocationResponse;
import com.homosphere.backend.model.Location;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface LocationMapper {

    LocationResponse toResponse(Location location);

    Location toEntity(LocationRequest locationRequest);

    java.util.List<LocationResponse> toResponseList(java.util.List<Location> locations);

    java.util.List<Location> toEntityList(java.util.List<LocationRequest> locationRequests);
}

