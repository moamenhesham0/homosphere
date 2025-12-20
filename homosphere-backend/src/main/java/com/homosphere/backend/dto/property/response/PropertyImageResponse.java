package com.homosphere.backend.dto.property.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyImageResponse {
    private UUID propertyImageId;
    private String imageUrl;
}
