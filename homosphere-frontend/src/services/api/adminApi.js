import { apiRequest } from './apiClient';

export const adminApi = {
    getAllAdmins(token) {
        return apiRequest('/api/admin/admins', {
            token,
        });
    },

    addAdmin(adminData, token) {
        return apiRequest('/api/admin/admins', {
            method: 'POST',
            token,
            body: adminData,
        });
    },

    removeAdmin(userId, token) {
        return apiRequest(`/api/admin/admins/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
            token,
        });
    },

    removeUserAccount(userId, token) {
        return apiRequest(`/api/admin/users/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
            token,
        });
    },
};
