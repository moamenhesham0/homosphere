package com.homosphere.backend.dto.property.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmissionReviewRequest {
    private UUID propertyListingId;
    private String message;
}
