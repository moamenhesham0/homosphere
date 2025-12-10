package com.homosphere.backend.dto;

import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingResponse {
    private Long propertyListingId;
    private String title;
    private String description;
    private Double price;
    private Long sellerId;
    private String sellerName;
    private Long brookerId;
    private String brookerName;
    private PropertyImageResponse bannerImage;
    private List<PropertyImageResponse> propertyImages;
    private PropertyResponse property;
    private Integer views;
    private PropertyListingStatus propertyListingStatus;
    private LocalDateTime submissionDate;
    private LocalDateTime publicationDate;
    private LocalDateTime lastUpdatedDate;
}
