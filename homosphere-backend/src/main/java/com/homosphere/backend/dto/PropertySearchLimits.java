package com.homosphere.backend.dto;

public record PropertySearchLimits(
        Double minPrice,
        Double maxPrice,
        Double minLotArea,
        Double maxLotArea,
        Double minPropertyArea,
        Double maxPropertyArea,
        Integer minBathrooms,
        Integer maxBathrooms,
        Integer minBedrooms,
        Integer maxBedrooms
) {
}
