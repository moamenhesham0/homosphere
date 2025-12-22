package com.homosphere.backend.dto.property.response;

import com.homosphere.backend.dto.LocationResponse;
import com.homosphere.backend.dto.property.AmenityDTO;
import com.homosphere.backend.enums.PropertyCondition;
import com.homosphere.backend.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {
    private UUID propertyId;
    private Double propertyAreaSqFt;
    private Double lotAreaSqFt;
    private Integer bedrooms;
    private Integer bathrooms;
    private PropertyType type;
    private Year yearBuilt;
    private List<AmenityDTO> amenities;
    private LocationResponse location;
    private PropertyCondition condition;
}
