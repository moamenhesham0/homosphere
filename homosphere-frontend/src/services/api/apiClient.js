const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;

export const API_BASE_URL = (viteEnv?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/+$/,
    '',
);

function normalizePath(path) {
    if (!path) {
        throw new Error('API path is required.');
    }

    return path.startsWith('/') ? path : `/${path}`;
}

function buildQueryString(query) {
    if (!query) {
        return '';
    }

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item !== undefined && item !== null && item !== '') {
                    params.append(key, String(item));
                }
            });
            return;
        }

        params.append(key, String(value));
    });

    return params.toString();
}

function buildUrl(path, query) {
    const queryString = buildQueryString(query);
    const normalizedPath = normalizePath(path);

    if (!queryString) {
        return `${API_BASE_URL}${normalizedPath}`;
    }

    return `${API_BASE_URL}${normalizedPath}?${queryString}`;
}

function normalizeBearerToken(token) {
    if (!token || typeof token !== 'string') {
        return null;
    }

    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

function getErrorMessage(payload, status) {
    if (typeof payload === 'string' && payload.trim() !== '') {
        return payload;
    }

    if (payload && typeof payload === 'object') {
        if (typeof payload.message === 'string' && payload.message.trim() !== '') {
            return payload.message;
        }

        if (typeof payload.error === 'string' && payload.error.trim() !== '') {
            return payload.error;
        }
    }

    return `Request failed with status ${status}`;
}

/**
 * Generic fetch wrapper for the Homosphere backend.
 *
 * @param {string} path - API path beginning with /api.
 * @param {Object} options - Request options.
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {Object} [options.query] - Query params.
 * @param {*} [options.body] - Request payload (plain object, string, FormData, etc.).
 * @param {Object} [options.headers] - Additional headers.
 * @param {string} [options.token] - Auth token (with or without Bearer prefix).
 * @param {AbortSignal} [options.signal] - Optional request signal.
 * @returns {Promise<*>} Parsed response payload.
 */
export async function apiRequest(path, options = {}) {
    const { method = 'GET', query, body, headers = {}, token, signal } = options;

    const requestHeaders = new Headers(headers);
    const authorizationHeader = normalizeBearerToken(token);

    if (authorizationHeader && !requestHeaders.has('Authorization')) {
        requestHeaders.set('Authorization', authorizationHeader);
    }

    let requestBody;
    if (body !== undefined && body !== null) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
        const isUrlSearchParams =
            typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

        if (isFormData || isBlob || isUrlSearchParams || typeof body === 'string') {
            requestBody = body;
        } else {
            requestHeaders.set('Content-Type', 'application/json');
            requestBody = JSON.stringify(body);
        }
    }

    const response = await fetch(buildUrl(path, query), {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal,
    });

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const error = new Error(getErrorMessage(payload, response.status));
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}
