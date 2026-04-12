import { apiRequest } from './apiClient';

export const paymentApi = {
    createOrder(orderData, token) {
        return apiRequest('/api/payment/create', {
            method: 'POST',
            token,
            body: orderData,
        });
    },

    captureOrder(orderId, token) {
        return apiRequest(`/api/payment/capture/${encodeURIComponent(orderId)}`, {
            method: 'POST',
            token,
        });
    },

    getMyCurrentSubscription(token) {
        return apiRequest('/api/payment/my-subscription', {
            token,
        });
    },
};

