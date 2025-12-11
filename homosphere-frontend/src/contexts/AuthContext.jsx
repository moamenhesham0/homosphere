import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setToken(session.access_token);
          setIsAuthenticated(true);
          // Don't set user here - let callback fetch from backend
        } else {

          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        setIsAuthenticated(true);

        // Fetch user profile from backend
        try {
          const { api } = await import('../utils/api');
          const response = await api.login(session.access_token);
          if (response && response.user) {
            setUser(response.user);
          }
        } catch (backendError) {
          console.error('Failed to fetch user profile:', backendError);
          // User is authenticated with Supabase but not in backend
          // They may need to complete their profile
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUserProfile = (userProfile) => {
    setUser(userProfile);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      // First, sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get the session token
      const session = data.session;
      const supabaseUser = data.user;

      if (session && session.access_token) {
        setToken(session.access_token);
        setIsAuthenticated(true);

        // Sync with backend
        try {
          const { api } = await import('../utils/api');
          const response = await api.login(session.access_token);

          // Set user profile from backend response
          if (response && response.user) {
            setUser(response.user);
          }
        } catch (backendError) {
          console.error('Backend sync error:', backendError);

          // If user not found in backend, auto-create them
          if (backendError.message?.includes('not found')) {
            try {
              const { api } = await import('../utils/api');

              // Try to create user in backend with Supabase data
              const role = supabaseUser.user_metadata?.role || 'BUYER';
              const signupData = {
                email: supabaseUser.email,
                firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email.split('@')[0],
                lastName: supabaseUser.user_metadata?.last_name || '',
                role: role.toUpperCase(), // Ensure uppercase for backend validation
                password: password // Backend expects this but won't use it since Supabase handles auth
              };

              const signupResponse = await api.signup(signupData, session.access_token);

              if (signupResponse && signupResponse.user) {
                setUser(signupResponse.user);
                return { success: true, message: 'Account synced successfully!' };
              }
            } catch (syncError) {
              console.error('Auto-sync failed:', syncError);
              throw new Error('Failed to sync account. Please contact support.');
            }
          } else {
            throw backendError;
          }
        }

        return { success: true, message: 'Signed in successfully!' };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (signupData) => {
    try {
      // First, sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            role: signupData.role,
          }
        }
      });

      if (error) throw error;

      // Check if email is already registered
      if (data.user?.identities?.length === 0) {
        throw new Error('Email already registered');
      }

      // Get the session token
      const session = data.session;
      if (session && session.access_token) {
        // Sync with backend
        const backendData = {
          email: signupData.email,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          role: signupData.role,
          password: signupData.password
        };

        const { api } = await import('../utils/api');
        const response = await api.signup(backendData, session.access_token);

        // Set user profile from backend response
        if (response && response.user) {
          setUser(response.user);
          setToken(session.access_token);
          setIsAuthenticated(true);
        }

        return { success: true, message: 'Account created successfully!' };
      } else {
        // Email verification required - no session yet
        return {
          success: true,
          message: 'Check your email for the confirmation link!',
          requiresVerification: true
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    setUserProfile,
    logout,
    login,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
