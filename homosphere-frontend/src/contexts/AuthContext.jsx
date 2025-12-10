import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

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
          // If user not found in backend, might need to complete signup
          throw new Error('Please complete your profile setup');
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
