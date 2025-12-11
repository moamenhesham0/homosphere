package com.homosphere.backend.dto;

import java.util.List;
import java.util.UUID;

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
    private PropertyImageRequest bannerImage;
    private List<PropertyImageRequest> propertyImages;
    private PropertyRequest property;
    private PropertyListingStatus propertyListingStatus;
}
