package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.property.request.PropertySubmissionReviewRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionReviewResponse;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyListingMapper.class})
public interface PropertySubmissionReviewMapper {

    PropertySubmissionReviewResponse toResponse(PropertySubmissionReview propertySubmissionReview);

    PropertySubmissionReview toEntity(PropertySubmissionReviewRequest propertySubmissionRequest);
}

