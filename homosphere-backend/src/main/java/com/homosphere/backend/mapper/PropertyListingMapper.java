package com.homosphere.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.model.property.PropertyListing;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyMapper.class, PropertyImageMapper.class})
public interface PropertyListingMapper {
    
    @Mapping(target = "sellerId", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getUserId() : null)")
    @Mapping(target = "sellerName", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getFirstName() + \" \" + propertyListing.getSeller().getLastName() : null)")
    @Mapping(target = "brokerId", expression = "java(propertyListing.getBroker() != null ? propertyListing.getBroker().getUserId() : null)")
    @Mapping(target = "brokerName", expression = "java(propertyListing.getBroker() != null ? propertyListing.getBroker().getFirstName() + \" \" + propertyListing.getBroker().getLastName() : null)")
    PropertyListingResponse toResponse(PropertyListing propertyListing);

    default java.util.UUID map(Long value) {
        return value == null ? null : java.util.UUID.nameUUIDFromBytes(value.toString().getBytes());
    }
}

