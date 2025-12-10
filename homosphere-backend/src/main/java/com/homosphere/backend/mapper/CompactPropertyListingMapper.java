package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyImageMapper.class})
public interface CompactPropertyListingMapper {

    @Mapping(target = "id", source = "propertyListingId")
    @Mapping(target = "bannerImage", source = "bannerImage")
    @Mapping(target = "bathrooms", source = "property.bathrooms")
    @Mapping(target = "bedrooms", source = "property.bedrooms")
    @Mapping(target = "city", source = "property.location.city")
    @Mapping(target = "state", source = "property.location.state")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);
}

