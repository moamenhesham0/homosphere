package com.homosphere.backend.dto.property.response;

import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingPublicResponse {
    private UUID propertyListingId;
    private String title;
    private String description;
    private Double price;
    private String sellerName;
    private String brokerName;
    private PropertyImageResponse bannerImage;
    private List<PropertyImageResponse> propertyImages;
    private PropertyResponse property;
    private Integer views;
    private LocalDateTime publicationDate;
    private LocalDateTime lastUpdatedDate;
}
