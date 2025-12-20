package com.homosphere.backend.dto.property.response;


import com.homosphere.backend.enums.PropertyListingManagementStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingDraftResponse {
    private UUID propertyListingId;
    private String title;
    private PropertyResponse propertyResponse;
    private String description;
    private Double price;
    private PropertyImageResponse bannerImage;
    private List<PropertyImageResponse> propertyImages;
    private PropertyListingManagementStatus managementStatus;
}
