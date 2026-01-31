package com.homosphere.backend.dto.property.request;

import com.homosphere.backend.dto.LocationRequest;
import com.homosphere.backend.dto.property.AmenityDTO;
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
public class PropertyRequest {
    private Double propertyAreaSqFt;
    private Double lotAreaSqFt;
    private Integer bedrooms;
    private Integer bathrooms;
    private PropertyType type;
    private LocationRequest location;
    private Year yearBuilt;
    private PropertyCondition condition;
    private List<AmenityDTO> amenities;
}
