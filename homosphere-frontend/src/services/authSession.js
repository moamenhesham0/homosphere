const AUTH_TOKEN_STORAGE_KEY = 'homosphere.authToken';
const AUTH_USER_STORAGE_KEY = 'homosphere.authUser';
const USER_ROLES = {
    BUYER: 'BUYER',
    SELLER: 'SELLER',
    BROKER: 'BROKER',
};

function normalizeRole(role) {
    if (typeof role !== 'string') {
        return '';
    }

    return role.trim().toUpperCase();
}

function extractUserRole(user) {
    const role = user?.user_metadata?.role;

    console.log(`Extracting role from user: ${user?.id}, raw role: ${role}`);
    const normalizedRole = normalizeRole(role);
    if (normalizedRole) {
        return normalizedRole;
    }
    return '';
}

function normalizeUserWithRoleFlags(user) {
    if (!user || typeof user !== 'object') {
        return null;
    }

    const normalizedRole = extractUserRole(user);
    const roleForFlags =
        normalizedRole === USER_ROLES.SELLER || normalizedRole === USER_ROLES.BROKER
            ? normalizedRole
            : USER_ROLES.BUYER;

    return {
        ...user,
        role: normalizedRole || roleForFlags,
        buyer: roleForFlags === USER_ROLES.BUYER,
        seller: roleForFlags === USER_ROLES.SELLER,
        broker: roleForFlags === USER_ROLES.BROKER,
    };
}

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

export async function saveAuthSession(token, user) {
    console.log('Saving auth session with token:', token, 'and user:', user);
    const normalizedUser = normalizeUserWithRoleFlags(user);
    writeToStorage(AUTH_TOKEN_STORAGE_KEY, token || '');
    writeToStorage(AUTH_USER_STORAGE_KEY, normalizedUser ? JSON.stringify(normalizedUser) : '');
}

export function clearAuthSession() {
    writeToStorage(AUTH_TOKEN_STORAGE_KEY, '');
    writeToStorage(AUTH_USER_STORAGE_KEY, '');
}
