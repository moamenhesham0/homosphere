import { apiRequest } from './apiClient';

export const viewingRequestApi = {
    createViewingRequest(viewingRequestData, token) {
        return apiRequest('/api/viewing-requests', {
            method: 'POST',
            token,
            body: viewingRequestData,
        });
    },

    getCurrentUserViewingRequests(token) {
        return apiRequest('/api/viewing-requests/user', {
            token,
        });
    },

    getSellerViewingRequests(sellerId, token) {
        return apiRequest(`/api/viewing-requests/seller/${encodeURIComponent(sellerId)}`, {
            token,
        });
    },

    getBuyerViewingRequests(buyerId, token) {
        return apiRequest(`/api/viewing-requests/buyer/${encodeURIComponent(buyerId)}`, {
            token,
        });
    },

    updateViewingRequestStatus(requestId, statusUpdateData, token) {
        return apiRequest(`/api/viewing-requests/${encodeURIComponent(requestId)}/status`, {
            method: 'PATCH',
            token,
            body: statusUpdateData,
        });
    },
};

