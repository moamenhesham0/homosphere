package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.property.request.PropertySubmissionRequest;
import com.homosphere.backend.dto.property.response.PropertySubmissionResponse;
import com.homosphere.backend.model.property.PropertySubmissionReview;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyListingMapper.class})
public interface PropertySubmissionMapper {

    PropertySubmissionResponse toResponse(PropertySubmissionReview propertySubmissionReview);

    PropertySubmissionReview toEntity(PropertySubmissionRequest propertySubmissionRequest);
}

