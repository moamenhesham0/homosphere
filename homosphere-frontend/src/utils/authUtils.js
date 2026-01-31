import { supabase } from '../utils/supabase';


const AUTH_HEADER = import.meta.env.VITE_AUTH_HEADER;
const AUTH_PREFIX = import.meta.env.VITE_AUTH_PREFIX;

/**
 * Get the authentication token from Supabase session
 */
export async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Get authorization headers for API requests
 */
export async function getAuthHeaders() {
    const token = await getAuthToken();
    return {
        'Content-Type': 'application/json',
        [AUTH_HEADER]: `${AUTH_PREFIX} ${token}`,
    };
}