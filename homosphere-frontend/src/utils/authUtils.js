const AUTH_HEADER = import.meta.env.VITE_AUTH_HEADER;
const AUTH_PREFIX = import.meta.env.VITE_AUTH_PREFIX;

/**
 * Get authorization headers for API requests
 * @returns {Promise<{'Content-Type': string, [AUTH_HEADER]: string}>}
 */
export async function getAuthHeaders(token) {
    return {
        'Content-Type': 'application/json',
        [AUTH_HEADER]: `${AUTH_PREFIX} ${token}`,
    };
}

/**
 * Get headers for unauthenticated requests
 * @returns {Promise<{'Content-Type': string}>}
 */
export async function getUnauthHeaders() {
    return {
        'Content-Type': 'application/json',
    };
}
