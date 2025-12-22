package com.homosphere.backend.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import com.homosphere.backend.repository.PropertyListingRepository;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyListingMapper.class})
public interface PropertySubmissionReviewMapper {


    PropertySubmissionReviewResponse toResponse(PropertySubmissionReview propertySubmissionReview);

    @Mapping(target = "propertyListing", source = "propertyListingId")
    PropertySubmissionReview toEntity(PropertySubmissionReviewRequest propertySubmissionRequest, @Context PropertyListingRepository propertyListingRepository);


    default com.homosphere.backend.model.property.PropertyListing map(java.util.UUID id, @Context PropertyListingRepository repo) {
        return id == null ? null : repo.findById(id).orElse(null);
    }
}

