package com.homosphere.backend.dto;

import org.springframework.data.domain.Sort.Direction;
import com.homosphere.backend.enums.PropertyType;

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
        PropertyType type,
        String state,
        String city,
        Integer page,
        Integer pageSize,
        String sortField,
        Direction sortDirection
) {

    private final static int DEFAULT_PAGE = 0;
    private final static int DEFAULT_PAGE_SIZE = 20;
    private final static Direction DEFAULT_SORT_DIRECTION = Direction.DESC;
    public PropertySearchParams {
        page = page == null || page < 0 ? DEFAULT_PAGE : page;
        pageSize = pageSize == null || pageSize < 0 ? DEFAULT_PAGE_SIZE : pageSize;
        sortField = (sortField == null || sortField.isBlank()) ? "price" : sortField;
        sortDirection = sortDirection == null ? DEFAULT_SORT_DIRECTION : sortDirection;

        if ("propertyAreaSqFt".equals(sortField)) {
            sortField = "property.propertyAreaSqFt";
        } else if ("lotAreaSqFt".equals(sortField)) {
            sortField = "property.lotAreaSqFt";
        }
    }
}