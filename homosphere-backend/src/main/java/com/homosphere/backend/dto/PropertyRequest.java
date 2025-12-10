package com.homosphere.backend.dto;

import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;
import com.homosphere.backend.model.Amenity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyRequest {
    private Double areaInSquareMeters;
    private Integer bedrooms;
    private Integer bathrooms;
    private PropertyType propertyType;
    private Long locationId;
    private Year yearBuilt;
    private PropertyCondition propertyCondition;
    private List<AmenityDTO> amenities;
}
