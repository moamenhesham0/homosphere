package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyImageMapper.class})
public interface CompactPropertyListingMapper {

    @Mapping(target = "propertyListingId", source = "propertyListingId")
    @Mapping(target = "bannerImage", source = "bannerImage")
    @Mapping(target = "bathrooms", source = "property.bathrooms")
    @Mapping(target = "bedrooms", source = "property.bedrooms")
    @Mapping(target = "city", source = "property.location.city")
    @Mapping(target = "state", source = "property.location.state")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);

    // Note: CompactPropertyListingRequest doesn't exist - this mapper is response-only
    // If needed, create CompactPropertyListingRequest DTO first
}

