package com.homosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponse {
    private Long locationId;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private Double latitude;
    private Double longitude;
}
