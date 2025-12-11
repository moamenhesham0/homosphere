// Backend API configuration with flexible URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// API call helper with token authentication
export const apiCall = async (endpoint, options = {}, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    // Add token to headers if provided
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers,
    };

    // Add body only for methods that support it
    if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
        config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ 
            message: 'Network error',
            status: response.status 
        }));
        throw new Error(error.message || 'API request failed');
    }
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    
    return null;
};

// API methods that require token to be passed from context
export const api = {
    // Sync Google user with backend
    syncGoogleUser: (data, token) => apiCall('/api/auth/google-signup', {
        method: 'POST',
        body: data
    }, token),

    // Regular signup - sync user data with backend after Supabase signup
    signup: (data, token) => apiCall('/api/auth/signup', {
        method: 'POST',
        body: data
    }, token),
    
    // Login - sync with backend after Supabase authentication
    login: (token) => apiCall('/api/auth/login', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),

    // Get user profile from backend
    getUserProfile: (token) => apiCall('/api/user/profile', {
        method: 'GET'
    }, token),
    
    // Update user profile
    updateProfile: (data, token) => apiCall('/api/user/profile', {
        method: 'PUT',
        body: data
    }, token),

};

export default api;
