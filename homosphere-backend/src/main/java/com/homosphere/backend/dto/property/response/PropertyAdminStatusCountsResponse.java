package com.homosphere.backend.dto.property.response;

public record PropertyAdminStatusCountsResponse(long pending, long flagged, long processed) {
}
