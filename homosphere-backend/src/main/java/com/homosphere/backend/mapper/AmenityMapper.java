package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.AmenityDTO;
import com.homosphere.backend.model.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AmenityMapper {

    AmenityDTO toDTO(Amenity amenity);

    Amenity toEntity(AmenityDTO amenityDTO);
}

