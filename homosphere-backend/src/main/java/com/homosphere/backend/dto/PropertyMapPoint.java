package com.homosphere.backend.dto;

import java.util.UUID;

public record PropertyMapPoint(
        UUID propertyListingId,
        Double price,
        String title,
        String bannerImage,
        Double longitude,
        Double latitude
) {}
