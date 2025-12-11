package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.PropertyImageRequest;
import com.homosphere.backend.dto.PropertyImageResponse;
import com.homosphere.backend.model.PropertyImage;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PropertyImageMapper {

    PropertyImageResponse toResponse(PropertyImage propertyImage);

    PropertyImage toEntity(PropertyImageRequest propertyImageRequest);
}

