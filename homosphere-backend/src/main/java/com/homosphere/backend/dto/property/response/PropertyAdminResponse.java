package com.homosphere.backend.dto.property.response;

import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.EnumMap;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyAdminResponse {
    // Map each PropertyListingStatus to a list of CompactPropertyListingResponse
    private EnumMap<PropertyListingStatus, List<CompactPropertyListingResponse>> propertiesByStatus;
}
