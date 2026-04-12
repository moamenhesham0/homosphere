import { apiRequest } from './apiClient';

export const userApi = {
    createPublicUser(userData) {
        return apiRequest('/api/public/user', {
            method: 'POST',
            body: userData,
        });
    },

    updateCurrentUser(userData, token) {
        return apiRequest('/api/user', {
            method: 'PUT',
            token,
            body: userData,
        });
    },

    getCurrentUser(token) {
        return apiRequest('/api/user', {
            token,
        });
    },

    getPublicUserById(userId, token) {
        return apiRequest(`/api/public/retrieveInf/${encodeURIComponent(userId)}`, {
            token,
        });
    },

    signupUserById(userId) {
        return apiRequest(`/api/public/signup/${encodeURIComponent(userId)}`);
    },

    deleteCurrentUser(token) {
        return apiRequest('/api/user', {
            method: 'DELETE',
            token,
        });
    },

    getCurrentPublicUser(token) {
        return apiRequest('/api/user/public', {
            token,
        });
    },

    getPrivateUserById(userId, token) {
        return apiRequest(`/api/user/${encodeURIComponent(userId)}`, {
            token,
        });
    },
};

