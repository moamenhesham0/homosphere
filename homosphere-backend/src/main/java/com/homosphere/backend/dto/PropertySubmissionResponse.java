package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmissionResponse {
    private PropertyListingResponse propertyListing;
    private String message;
    private LocalDateTime submissionDate;
}
