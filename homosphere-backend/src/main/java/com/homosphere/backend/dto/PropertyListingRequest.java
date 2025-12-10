package com.homosphere.backend.dto;

import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingRequest {
    private String title;
    private String description;
    private Double price;
    private Long brookerId;
    private Long bannerImageId;
    private List<Long> propertyImageIds;
    private PropertyRequest property;
    private PropertyListingStatus propertyListingStatus;
}
