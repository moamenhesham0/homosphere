package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertySubmissionRequest {
    private PropertyListingRequest propertyListingRequest;
    private String message;
}
