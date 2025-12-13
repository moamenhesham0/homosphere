package com.homosphere.backend.mapper;

import com.homosphere.backend.dto.PropertySubmissionRequest;
import com.homosphere.backend.dto.PropertySubmissionResponse;
import com.homosphere.backend.model.PropertySubmission;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {PropertyListingMapper.class})
public interface PropertySubmissionMapper {

    PropertySubmissionResponse toResponse(PropertySubmission propertySubmission);

    PropertySubmission toEntity(PropertySubmissionRequest propertySubmissionRequest);
}

