/**
 * Decode JWT token without verification (client-side)
 * Note: This doesn't verify the signature - just parses the payload
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Extract user information from Supabase JWT token
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Log the entire decoded token to see structure
  console.log('Decoded token:', decoded);
  console.log('User metadata:', decoded.user_metadata);
  console.log('App metadata:', decoded.app_metadata);

  // Try multiple possible locations for role
  const role = decoded.user_metadata?.role || 
               decoded.app_metadata?.role || 
               decoded.role ||
               decoded.user_metadata?.user_role;

  console.log('Extracted role:', role);

  return {
    id: decoded.sub,
    email: decoded.email,
    role: role,
    firstName: decoded.user_metadata?.first_name || decoded.user_metadata?.firstName,
    lastName: decoded.user_metadata?.last_name || decoded.user_metadata?.lastName,
  };
};
