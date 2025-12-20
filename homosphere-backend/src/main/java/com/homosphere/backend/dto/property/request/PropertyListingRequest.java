package com.homosphere.backend.dto.property.request;

import java.util.List;
import java.util.UUID;

import com.homosphere.backend.enums.PropertyListingManagementStatus;
import com.homosphere.backend.enums.PropertyListingStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingRequest {
    private String title;
    private String description;
    private Double price;
    private UUID sellerId;
    private PropertyListingManagementStatus status;
    private PropertyImageRequest bannerImage;
    private List<PropertyImageRequest> propertyImages;
    private UUID brokerId;
    private PropertyImageRequest bannerImageId;
    private PropertyRequest property;
    private PropertyListingStatus propertyListingStatus;
}
