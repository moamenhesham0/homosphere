package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.PropertyMapPoint;
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

    @Mapping(target = "broker", ignore = true)
    @Mapping(target = "views", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "lastSubmissionDate", ignore = true)
    @Mapping(target = "publicationDate", ignore = true)
    @Mapping(target = "lastUpdatedDate", ignore = true)
    @Mapping(target = "soldDate", ignore = true)
    @Mapping(target = "savedByUsers", ignore = true)
    @Mapping(target = "propertyListingId", ignore = true)
    @Mapping(target = "seller", source = "sellerId")
    @Mapping(target = "propertyImages", ignore = true)
    @Mapping(target = "bannerImage", ignore = true)
    PropertyListing toEntity(PropertyListingRequest propertyListingRequest, @Context UserRepository userRepository);

    @Mapping(target = "sellerId", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getId() : null)")
    @Mapping(target = "sellerName", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getName() : null)")
    @Mapping(target = "brokerId", expression = "java(propertyListing.getBroker() != null ? propertyListing.getBroker().getId() : null)")
    @Mapping(target = "brokerName", expression = "java(propertyListing.getBroker() != null ? propertyListing.getBroker().getName() : null)")
    @Mapping(target = "creationData", source = "creationDate")
    @Mapping(target = "lastSubmissionData", source = "lastSubmissionDate")
    PropertyListingResponse toResponse(PropertyListing propertyListing);

    @Mapping(target = "sellerName", expression = "java(propertyListing.getSeller() != null ? propertyListing.getSeller().getName() : null)")
    @Mapping(target = "brokerName", expression = "java(propertyListing.getBroker() != null ? propertyListing.getBroker().getName() : null)")
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
    @Mapping(target = "status", source = "status")
    @Mapping(target = "condition", source = "property.condition")
    @Mapping(target = "longitude" , source = "property.location.longitude")
    @Mapping(target = "type", source = "property.type")
    @Mapping(target = "latitude" , source = "property.location.latitude")
    CompactPropertyListingResponse toCompactResponse(PropertyListing propertyListing);


    @Mapping(target = "propertyListingId", source = "propertyListingId")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "bannerImage", source = "bannerImage.imageUrl")
    @Mapping(target = "longitude" , source = "property.location.longitude")
    @Mapping(target = "latitude" , source = "property.location.latitude")
    PropertyMapPoint toMapPoint(PropertyListing propertyListing);


    default User map(UUID id, @Context UserRepository repo) {
        return id == null ? null : repo.findById(id).orElse(null);
    }
}
