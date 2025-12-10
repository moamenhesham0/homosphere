package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.PropertyRequest;
import com.homosphere.backend.dto.PropertyResponse;
import com.homosphere.backend.model.Property;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {LocationMapper.class, AmenityMapper.class})
public interface PropertyMapper {

    @Mapping(target = "type", source = "type")
    PropertyResponse toResponse(Property property);

    @Mapping(target = "propertyId", ignore = true)
    @Mapping(target = "type", source = "propertyType")
    @Mapping(target = "condition", source = "propertyCondition")
    @Mapping(target = "location", ignore = true)
    Property toEntity(PropertyRequest propertyRequest);
}

