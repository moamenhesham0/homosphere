package com.homosphere.backend.dto;

import java.time.Year;
import java.util.List;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyRequest {
    private Double areaInSquareMeters;
    private Integer bedrooms;
    private Integer bathrooms;
    private PropertyType propertyType;
    private LocationRequest location;
    private Year yearBuilt;
    private PropertyCondition propertyCondition;
    private List<AmenityDTO> amenities;
}
