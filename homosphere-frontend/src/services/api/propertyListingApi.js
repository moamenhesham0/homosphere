import { apiRequest } from './apiClient';

export const propertyListingApi = {
    submitPropertyListing(listingData, token) {
        return apiRequest('/api/property-listing/submit', {
            method: 'POST',
            token,
            body: listingData,
        });
    },

    resubmitPropertyListing(draftData, token) {
        return apiRequest('/api/property-listing/resubmit', {
            method: 'PUT',
            token,
            body: draftData,
        });
    },

    editPropertyListing(editData, token) {
        return apiRequest('/api/property-listing/edit', {
            method: 'PUT',
            token,
            body: editData,
        });
    },

    deletePropertyListing(propertyListingId, token) {
        return apiRequest(`/api/property-listing/delete/${encodeURIComponent(propertyListingId)}`, {
            method: 'DELETE',
            token,
        });
    },

    getPropertyListingById(propertyListingId, token) {
        return apiRequest(`/api/property-listing/${encodeURIComponent(propertyListingId)}`, {
            token,
        });
    },

    getPublicPropertyListingById(propertyListingId) {
        return apiRequest(`/api/property-listing/public/${encodeURIComponent(propertyListingId)}`);
    },

    getPropertyListingStore(token) {
        return apiRequest('/api/property-listing/store', {
            token,
        });
    },

    getUserPropertyListingTabs(userId, token) {
        return apiRequest(`/api/property-listing/status/${encodeURIComponent(userId)}`, {
            token,
        });
    },

    getUserPropertyListings(userId, token) {
        return apiRequest(`/api/property-listing/user/${encodeURIComponent(userId)}`, {
            token,
        });
    },

    getPublishedPropertyListingsByUser(userId) {
        return apiRequest(`/api/property-listing/public/user/${encodeURIComponent(userId)}`);
    },

    toggleSaveProperty(propertyListingId, userId, token) {
        return apiRequest(
            `/api/property-listing/public/user/${encodeURIComponent(propertyListingId)}/save/${encodeURIComponent(
                userId,
            )}`,
            {
                method: 'POST',
                token,
            },
        );
    },

    getSavedPropertyIds(userId, token) {
        return apiRequest(`/api/property-listing/public/user/saved-ids/${encodeURIComponent(userId)}`, {
            token,
        });
    },

    getSavedPropertyListings(userId, token) {
        return apiRequest(`/api/property-listing/saved/${encodeURIComponent(userId)}`, {
            token,
        });
    },

    searchPropertyListings(searchParams = {}, token) {
        return apiRequest('/api/property-listing/search', {
            method: 'GET',
            query: searchParams,
            token
        });
    },

    getSearchLimits() {
      return apiRequest('/api/property-listing/limits', {
          method: 'GET'
      })
    },

    getPropertyListingStorePage({ token, page = 0, size = 3, sortField = 'price', sortDirection = 'desc' }) {
        return apiRequest(
            `/api/property-listing/store-page?page=${page}&size=${size}&sort=${sortField},${sortDirection}`,
            { token }
        );
    },

    getPropertyListingUserPage({ token, page = 0, size = 6, sortField = 'price', sortDirection = 'desc' }) {
        return apiRequest(
            `/api/property-listing/user-page?page=${page}&size=${size}&sort=${sortField},${sortDirection}`,
            { token }
        );
    }
};

