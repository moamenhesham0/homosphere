package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CompactPropertyListingMapper {

    @Mapping(target = "id", source = "propertyListingId")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "bannerImage", source = "bannerImage")
    @Mapping(target = "bathrooms", source = "property.bathrooms")
    @Mapping(target = "bedrooms", source = "property.bedrooms")
    @Mapping(target = "city", source = "property.location.city")
    @Mapping(target = "state", source = "property.location.state")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);

    default java.util.UUID map(Long value) {
        return value == null ? null : new java.util.UUID(0L, value);
    }
}

