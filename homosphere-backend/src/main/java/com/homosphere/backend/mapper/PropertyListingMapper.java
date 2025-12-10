package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.PropertyListingResponse;
import com.homosphere.backend.model.PropertyListing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyMapper.class, PropertyImageMapper.class})
public interface PropertyListingMapper {

    @Mapping(target = "sellerId", source = "seller.userId")
    @Mapping(target = "sellerName", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getProfile().getFirstName() + \" \" + propertyListing.getSeller().getProfile().getLastName() : null)")
    @Mapping(target = "brookerId", source = "brooker.userId")
    @Mapping(target = "brookerName", expression = "java(propertyListing.getBrooker() != null ? propertyListing.getBrooker().getProfile().getFirstName() + \" \" + propertyListing.getBrooker().getProfile().getLastName() : null)")
    PropertyListingResponse toResponse(PropertyListing propertyListing);
}

