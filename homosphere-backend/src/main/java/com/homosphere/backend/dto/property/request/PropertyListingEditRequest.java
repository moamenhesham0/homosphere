package com.homosphere.backend.dto.property.request;

import com.homosphere.backend.enums.PropertyListingManagementStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyListingEditRequest {
    private UUID propertyListingId;
    private String title;
    private Double price;
    private String description;
    private PropertyListingManagementStatus managementStatus;
}
