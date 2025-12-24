package com.homosphere.backend.dto.property.request;


import com.homosphere.backend.enums.PropertyListingManagementStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingDraftRequest {
    private UUID propertyListingId;
    private String title;
    private String description;
    private Double price;
    private PropertyListingManagementStatus managementStatus;
    private PropertyImageRequest bannerImage;
    private List<PropertyImageRequest> propertyImages;
    private PropertyRequest property;
}
