package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.CompactPropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;


@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CompactPropertyListingMapper {

    @Mapping(target = "propertyListingId", source = "propertyListingId")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "bannerImage", source = "bannerImage")
    @Mapping(target = "bathrooms", source = "property.bathrooms")
    @Mapping(target = "bedrooms", source = "property.bedrooms")
    @Mapping(target = "city", source = "property.location.city")
    @Mapping(target = "state", source = "property.location.state")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);

}