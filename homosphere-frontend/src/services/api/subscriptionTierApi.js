import { apiRequest } from './apiClient';

export const subscriptionTierApi = {
    getAllSubscriptionTiers() {
        return apiRequest('/api/subscription-tiers');
    },

    createSubscriptionTier(subscriptionTierData, token) {
        return apiRequest('/api/subscription-tiers', {
            method: 'POST',
            token,
            body: subscriptionTierData,
        });
    },

    getSubscriptionTierById(subscriptionTierId) {
        return apiRequest(`/api/subscription-tiers/${encodeURIComponent(subscriptionTierId)}`);
    },

    getSellerSubscriptionTiers() {
        return apiRequest('/api/subscription-tiers/seller-tiers');
    },

    getBuyerSubscriptionTiers() {
        return apiRequest('/api/subscription-tiers/buyer-tiers');
    },

    getSubscriptionTiersByRole(role) {
        return apiRequest(`/api/subscription-tiers/${encodeURIComponent(role)}-tiers`);
    },

    updateSubscriptionTier(subscriptionTierId, subscriptionTierData, token) {
        return apiRequest(`/api/subscription-tiers/${encodeURIComponent(subscriptionTierId)}`, {
            method: 'PUT',
            token,
            body: subscriptionTierData,
        });
    },

    deleteSubscriptionTier(subscriptionTierId, token) {
        return apiRequest(`/api/subscription-tiers/${encodeURIComponent(subscriptionTierId)}`, {
            method: 'DELETE',
            token,
        });
    },
};

