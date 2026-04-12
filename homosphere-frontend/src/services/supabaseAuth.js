const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;

const SUPABASE_URL = (viteEnv?.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY =
    viteEnv?.VITE_SUPABASE_ANON_KEY || viteEnv?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

function parseSupabaseError(payload, status) {
    if (payload && typeof payload === 'object') {
        if (typeof payload.msg === 'string' && payload.msg.trim() !== '') {
            return payload.msg;
        }

        if (typeof payload.message === 'string' && payload.message.trim() !== '') {
            return payload.message;
        }

        if (typeof payload.error_description === 'string' && payload.error_description.trim() !== '') {
            return payload.error_description;
        }

        if (typeof payload.error === 'string' && payload.error.trim() !== '') {
            return payload.error;
        }
    }

    if (typeof payload === 'string' && payload.trim() !== '') {
        return payload;
    }

    return `Supabase request failed with status ${status}`;
}

export async function signUpWithSupabase({ email, password }) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error(
            'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend env.',
        );
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(parseSupabaseError(payload, response.status));
    }

    const accessToken = payload?.session?.access_token || '';

    if (!accessToken) {
        throw new Error(
            'Supabase signup succeeded but no access token was returned. If email confirmation is enabled, verify email and then sign in before backend sync.',
        );
    }

    return {
        accessToken,
        user: payload?.user || null,
    };
}

export async function signInWithSupabase({ email, password }) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error(
            'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend env.',
        );
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(parseSupabaseError(payload, response.status));
    }

    const accessToken = payload?.access_token || '';

    if (!accessToken) {
        throw new Error('Supabase sign in succeeded but no access token was returned.');
    }

    return {
        accessToken,
        user: payload?.user || null,
    };
}