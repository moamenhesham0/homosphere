package com.homosphere.backend.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompactPropertyListingResponse {
    private UUID propertyListingId;
    private String title;
    private Double price;
    private PropertyImageResponse bannerImage;
    private Integer bathrooms;
    private Integer bedrooms;
    private String city;
    private String state;
}
