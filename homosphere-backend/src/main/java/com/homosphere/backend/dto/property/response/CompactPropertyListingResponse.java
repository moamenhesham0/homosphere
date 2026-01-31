package com.homosphere.backend.dto.property.response;

import java.util.UUID;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompactPropertyListingResponse {
    private UUID propertyListingId;
    private String title;
    private Double price;
    private PropertyImageResponse bannerImage;
    private Double propertyAreaSqFt;
    private PropertyListingStatus status;
    private Double lotAreaSqFt;
    private Integer bathrooms;
    private Integer bedrooms;
    private PropertyCondition condition;
    private String city;
    private String state;
}
