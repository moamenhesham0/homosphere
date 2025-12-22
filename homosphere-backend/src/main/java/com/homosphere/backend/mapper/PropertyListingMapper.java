package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.property.request.PropertyListingRequest;
import com.homosphere.backend.dto.property.response.CompactPropertyListingResponse;
import com.homosphere.backend.dto.property.response.PropertyListingPublicResponse;
import com.homosphere.backend.dto.property.response.PropertyListingResponse;
import com.homosphere.backend.model.User;
import com.homosphere.backend.model.property.PropertyListing;
import com.homosphere.backend.repository.UserRepository;
import org.mapstruct.*;

import java.util.UUID;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyMapper.class, PropertyImageMapper.class})
public interface PropertyListingMapper {

    @Mapping(target = "propertyListingId", ignore = true)
    @Mapping(target = "seller", source = "sellerId")
    @Mapping(target = "propertyImages", ignore = true)
    @Mapping(target = "bannerImage", ignore = true)
    PropertyListing toEntity(PropertyListingRequest propertyListingRequest, @Context UserRepository userRepository);

    PropertyListingResponse toResponse(PropertyListing propertyListing);

    PropertyListingPublicResponse toPublicResponse(PropertyListing propertyListing);

    @Mapping(target = "propertyListingId", source = "propertyListingId")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "bannerImage", source = "bannerImage")
    @Mapping(target = "bathrooms", source = "property.bathrooms")
    @Mapping(target = "bedrooms", source = "property.bedrooms")
    @Mapping(target = "lotAreaSqFt", source = "property.lotAreaSqFt")
    @Mapping(target = "propertyAreaSqFt", source = "property.propertyAreaSqFt")
    @Mapping(target = "city", source = "property.location.city")
    @Mapping(target = "state", source = "property.location.state")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);


    default User map(UUID id, @Context UserRepository repo) {
        return id == null ? null : repo.findById(id).orElse(null);
    }
}
