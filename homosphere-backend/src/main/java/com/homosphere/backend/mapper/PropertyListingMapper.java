package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import com.homosphere.backend.dto.PropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;
import org.mapstruct.*;

import com.homosphere.backend.dto.PropertyListingResponse;
import com.homosphere.backend.dto.PropertyListingRequest;
import com.homosphere.backend.model.PropertyListing;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyMapper.class, PropertyImageMapper.class})
public interface PropertyListingMapper {
    
    @Mapping(target = "sellerId", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getUserId() : null)")
    @Mapping(target = "sellerName", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getFirstName() + \" \" + propertyListing.getSeller().getLastName() : null)")
    @Mapping(target = "brookerId", expression = "java(propertyListing.getBrooker() != null ? propertyListing.getBrooker().getUserId() : null)")
    @Mapping(target = "brookerName", expression = "java(propertyListing.getBrooker() != null ? propertyListing.getBrooker().getFirstName() + \" \" + propertyListing.getBrooker().getLastName() : null)")
    PropertyListingResponse toResponse(PropertyListing propertyListing);

    default java.util.UUID map(Long value) {
        return value == null ? null : java.util.UUID.nameUUIDFromBytes(value.toString().getBytes());
    }
}

