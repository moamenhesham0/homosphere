package com.homosphere.backend.dto;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {
    private Long propertyId;
    private Double areaInSquareMeters;
    private Integer bedrooms;
    private Integer bathrooms;
    private PropertyType type;
    private Year yearBuilt;
    private List<AmenityDTO> amenities;
    private LocationResponse location;
    private PropertyCondition condition;
}
