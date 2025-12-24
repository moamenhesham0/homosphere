// PayPal Payment API Service
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Create a PayPal order
 * @param {string} tierName - Name of the subscription tier (e.g., "PREMIUM")
 * @param {string} tierType - MONTHLY or YEARLY
 * @param {string} currencyCode - Currency code (e.g., "USD")
 * @param {string} token - JWT auth token
 * @returns {Promise<{paymentId: number, orderId: string}>}
 */
export const createPayPalOrder = async (tierName, tierType, currencyCode, token) => {
    const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            tierName,
            tiertype: tierType,
            currencyCode
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create order' }));
        throw new Error(error.error || 'Failed to create PayPal order');
    }

    return response.json();
};

/**
 * Capture a PayPal order after approval
 * @param {string} orderId - PayPal order ID
 * @param {string} token - JWT auth token
 * @returns {Promise<{status: string, orderId: string, paymentId: number}>}
 */
export const capturePayPalOrder = async (orderId, token) => {
    const response = await fetch(`${API_BASE_URL}/api/payment/capture/${orderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to capture order' }));
        throw new Error(error.error || 'Failed to capture PayPal order');
    }

    return response.json();
};

/**
 * Get PayPal checkout URL for sandbox/live
 * @param {string} orderId - PayPal order ID
 * @returns {string} PayPal checkout URL
 */
export const getPayPalCheckoutUrl = (orderId) => {
    // Use sandbox for development, live for production
    const isProduction = import.meta.env.VITE_PAYPAL_ENV === 'production';
    const baseUrl = isProduction 
        ? 'https://www.paypal.com/checkoutnow'
        : 'https://www.sandbox.paypal.com/checkoutnow';
    
    return `${baseUrl}?token=${orderId}`;
};

export default {
    createPayPalOrder,
    capturePayPalOrder,
    getPayPalCheckoutUrl
};
