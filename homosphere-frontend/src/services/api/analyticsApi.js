import { apiRequest } from './apiClient';

export const analyticsApi = {
    getPropertyStats(propertyId, token) {
        return apiRequest(`/api/analytics/property/${encodeURIComponent(propertyId)}`, {
            token,
        });
    },

    getUserProperties(token) {
        return apiRequest('/api/analytics/properties/user', {
            token,
        });
    },

    getUserSubscriptionAnalytics(token) {
        return apiRequest('/api/analytics/subscriptions/user', {
            token,
        });
    },
};

