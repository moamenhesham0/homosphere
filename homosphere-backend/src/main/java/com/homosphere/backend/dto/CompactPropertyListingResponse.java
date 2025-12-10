package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompactPropertyListingResponse {
    private Long id;
    private String title;
    private Double price;
    private PropertyImageResponse bannerImage;
    private Integer bathrooms;
    private Integer bedrooms;
    private String city;
    private String state;
}
