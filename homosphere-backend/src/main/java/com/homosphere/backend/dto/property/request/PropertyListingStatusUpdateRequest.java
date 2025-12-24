package com.homosphere.backend.dto.property.request;

import com.homosphere.backend.enums.PropertyListingStatus;
import lombok.Data;
import java.util.UUID;

@Data
public class PropertyListingStatusUpdateRequest {
    private UUID propertyListingId;
    private PropertyListingStatus status;
}
