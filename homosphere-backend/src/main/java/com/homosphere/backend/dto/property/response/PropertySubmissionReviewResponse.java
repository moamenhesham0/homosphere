package com.homosphere.backend.dto.property.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmissionReviewResponse {
    private PropertyListingResponse propertyListing;
    private String message;
}
