package com.homosphere.backend.dto;

import org.springframework.data.domain.Sort.Direction;
public record PropertySearchParams(
        String searchQuery,
        Double minPrice,
        Double maxPrice,
        Double minLotAreaSqFt,
        Double maxLotAreaSqFt,
        Double minPropertyAreaSqFt,
        Double maxPropertyAreaSqFt,
        Integer bedrooms,
        Integer bathrooms,
        String type,
        String state,
        String city,
        Integer page,

        Integer pageSize,
        Direction sortDirection
) {

    private final static int DEFAULT_PAGE_SIZE = 40;
    public PropertySearchParams {
        // Shift to 0-based
        page = (page == null || page <= 0) ? 0 : page-1;
        pageSize = DEFAULT_PAGE_SIZE;


    }

}
