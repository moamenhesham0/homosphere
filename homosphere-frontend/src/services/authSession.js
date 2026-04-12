const AUTH_TOKEN_STORAGE_KEY = 'homosphere.authToken';
const AUTH_USER_STORAGE_KEY = 'homosphere.authUser';

function hasWindow() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readFromStorage(key) {
    if (!hasWindow()) {
        return null;
    }

    return window.localStorage.getItem(key);
}

function writeToStorage(key, value) {
    if (!hasWindow()) {
        return;
    }

    if (value === null || value === undefined || value === '') {
        window.localStorage.removeItem(key);
        return;
    }

    window.localStorage.setItem(key, value);
}

export function getAuthToken() {
    const token = readFromStorage(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return '';
    }

    return token;
}

export function getCurrentUser() {
    const raw = readFromStorage(AUTH_USER_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function getCurrentUserId() {
    const user = getCurrentUser();
    return user?.id || null;
}

export function saveAuthSession(token, user) {
    writeToStorage(AUTH_TOKEN_STORAGE_KEY, token || '');
    writeToStorage(AUTH_USER_STORAGE_KEY, user ? JSON.stringify(user) : '');
}

export function clearAuthSession() {
    writeToStorage(AUTH_TOKEN_STORAGE_KEY, '');
    writeToStorage(AUTH_USER_STORAGE_KEY, '');
}

