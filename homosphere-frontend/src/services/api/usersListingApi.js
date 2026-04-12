import { apiRequest } from './apiClient';

export const usersListingApi = {
    getAllUsers(params = {}, token) {
        return apiRequest('/api/admin/users-listing', {
            token,
            query: params,
        });
    },

    getUsersByRole(role, params = {}, token) {
        return apiRequest('/api/admin/users-listing/filter', {
            token,
            query: {
                role,
                ...params,
            },
        });
    },

    searchUsers(query, params = {}, token) {
        return apiRequest('/api/admin/users-listing/search', {
            token,
            query: {
                query,
                ...params,
            },
        });
    },
};

