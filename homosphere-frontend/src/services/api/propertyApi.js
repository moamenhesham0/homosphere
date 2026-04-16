import { apiRequest } from './apiClient';

export const propertyApi = {
    searchProperties(params = {}) {
        return apiRequest('/api/properties/search', {
            query: params,
        });
    },

    filterProperties(filters = {}) {
        return apiRequest('/api/properties/filter', {
            query: filters,
        });
    },

    getPropertyById(propertyId) {
        return apiRequest(`/api/properties/${encodeURIComponent(propertyId)}`);
    },

    getAllPropertyTypes() {
        return apiRequest('/api/properties/all-types');
    },

    getAllPropertyConditions() {
        return apiRequest('/api/properties/all-conditions');
    },

    getAllPropertiesPartitionedByStatus(token) {
        return apiRequest('/api/properties/admin/all-partitioned', {
            token,
        });
    },

    getPendingProperties(token) {
        return apiRequest('/api/properties/admin/pending', {
            token,
        });
    },

    getPublishedProperties(token) {
        return apiRequest('/api/properties/admin/published', {
            token,
        });
    },

    getRejectedProperties(token) {
        return apiRequest('/api/properties/admin/rejected', {
            token,
        });
    },

    getRequiresChangesProperties(token) {
        return apiRequest('/api/properties/admin/requires-changes', {
            token,
        });
    },

    getUnlistedProperties(token) {
        return apiRequest('/api/properties/admin/unlisted', {
            token,
        });
    },

    getSoldProperties(token) {
        return apiRequest('/api/properties/admin/sold', {
            token,
        });
    },

    updatePropertyListingStatus(statusUpdateData, token) {
        return apiRequest('/api/properties/update-status', {
            method: 'PUT',
            token,
            body: statusUpdateData,
        });
    },
};

