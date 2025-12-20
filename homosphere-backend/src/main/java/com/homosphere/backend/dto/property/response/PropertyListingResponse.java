package com.homosphere.backend.dto.property.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.homosphere.backend.enums.PropertyListingStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingResponse {
    private UUID propertyListingId;
    private String title;
    private String description;
    private Double price;
    private UUID sellerId;
    private String sellerName;
    private UUID brokerId;
    private String brokerName;
    private PropertyImageResponse bannerImage;
    private List<PropertyImageResponse> propertyImages;
    private PropertyResponse property;
    private Integer views;
    private PropertyListingStatus propertyListingStatus;
    private LocalDateTime publicationDate;
    private LocalDateTime lastUpdatedDate;
}
