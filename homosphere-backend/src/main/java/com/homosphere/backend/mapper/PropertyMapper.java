package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.homosphere.backend.dto.property.request.PropertyRequest;
import com.homosphere.backend.dto.property.response.PropertyResponse;
import com.homosphere.backend.model.property.Property;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {LocationMapper.class, AmenityMapper.class})
public interface PropertyMapper {

    @Mapping(target = "type", source = "type")
    PropertyResponse toResponse(Property property);

    @Mapping(target = "propertyId", ignore = true)
    Property toEntity(PropertyRequest propertyRequest);
}

