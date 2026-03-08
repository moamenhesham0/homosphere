export const PROPERTY_SEARCH_PARAMS = {
    minPrice: { group: 'price', type: 'number' },
    maxPrice: { group: 'price', type: 'number' },

    minLotAreaSqFt: { group: 'area', type: 'number' },
    maxLotAreaSqFt: { group: 'area', type: 'number' },

    minPropertyAreaSqFt: { group: 'area', type: 'number' },
    maxPropertyAreaSqFt: { group: 'area', type: 'number' },

    bedrooms: { group: 'details', type: 'number' },
    bathrooms: { group: 'details', type: 'number' },
    type: { group: 'details', type: 'string' },

    state: { group: 'location', type: 'string' },
    city: { group: 'location', type: 'string' },

    query: {type : 'string' },
    page: { type: 'number' }
};


