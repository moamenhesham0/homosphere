package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.homosphere.backend.dto.property.AmenityDTO;
import com.homosphere.backend.model.Amenity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AmenityMapper {
    
    AmenityDTO toDTO(Amenity amenity);
    Amenity toEntity(AmenityDTO amenityDTO);
}

