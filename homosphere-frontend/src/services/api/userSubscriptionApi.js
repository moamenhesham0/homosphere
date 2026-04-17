import { apiRequest } from './apiClient';

export const userSubscriptionApi = {
    getAllUserSubscriptions(token) {
        return apiRequest('/api/user-subscriptions', {
            token,
        });
    },

    getUserSubscriptionById(subscriptionId, token) {
        return apiRequest(`/api/user-subscriptions/${encodeURIComponent(subscriptionId)}`, {
            token,
        });
    },

    getMySubscriptions(token) {
        return apiRequest('/api/user-subscriptions/my-subscriptions', {
            token,
        });
    },

    getMyRoleAndTier(token) {
        return apiRequest('/api/user-subscriptions/my-role-tier', {
            token,
        });
    },

    getUserRoleAndTier(userId, token) {
        return apiRequest(`/api/user-subscriptions/user/${encodeURIComponent(userId)}/role-tier`, {
            token,
        });
    },

    createUserSubscription(subscriptionData, token) {
        return apiRequest('/api/user-subscriptions', {
            method: 'POST',
            token,
            body: subscriptionData,
        });
    },

    updateUserSubscription(subscriptionId, subscriptionData, token) {
        return apiRequest(`/api/user-subscriptions/${encodeURIComponent(subscriptionId)}`, {
            method: 'PUT',
            token,
            body: subscriptionData,
        });
    },

    updateMySubscriptionTier(updateData, token) {
        return apiRequest('/api/user-subscriptions/update-my-tier', {
            method: 'PUT',
            token,
            body: updateData,
        });
    },

    updateUserSubscriptionTier(userId, updateData, token) {
        return apiRequest(`/api/user-subscriptions/user/${encodeURIComponent(userId)}/update-tier`, {
            method: 'PUT',
            token,
            body: updateData,
        });
    },

    deleteUserSubscription(subscriptionId, token) {
        return apiRequest(`/api/user-subscriptions/${encodeURIComponent(subscriptionId)}`, {
            method: 'DELETE',
            token,
        });
    },
};

