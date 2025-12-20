package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.property.request.PropertyImageRequest;
import com.homosphere.backend.dto.property.response.PropertyImageResponse;
import com.homosphere.backend.model.property.PropertyImage;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PropertyImageMapper {
    // MapStruct will automatically map fields with matching names
    PropertyImageResponse toResponse(PropertyImage propertyImage);
    PropertyImage toEntity(PropertyImageRequest propertyImageRequest);
}

