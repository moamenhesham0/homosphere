import { apiRequest } from './apiClient';

export const authApi = {
    googleSignup(token, signupData) {
        return apiRequest('/api/auth/google-signup', {
            method: 'POST',
            token,
            body: signupData,
        });
    },

    signup(token, signupData) {
        return apiRequest('/api/auth/signup', {
            method: 'POST',
            token,
            body: signupData,
        });
    },

    login(token) {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            token,
        });
    },
};

