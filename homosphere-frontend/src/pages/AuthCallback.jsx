import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import api from '../utils/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUserProfile } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate(ROUTES.SIGNIN), 2000);
          return;
        }

        if (session) {
          const token = session.access_token;
          
          try {
            // Parse user metadata from Google OAuth
            const userMetadata = session.user.user_metadata || {};
            const fullName = userMetadata.full_name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Sync user with backend (create or update)
            await api.syncGoogleUser({
              email: session.user.email,
              firstName: firstName,
              lastName: lastName,
              avatarUrl: userMetadata.avatar_url || userMetadata.picture || null,
              googleId: session.user.id,
              role: 'BUYER' // Default role for Google signup
            }, token);

            // Fetch complete user profile from backend
            const userProfile = await api.getUserProfile(token);
            
            // Store user profile in context (memory only)
            setUserProfile(userProfile);
            
            console.log('User authenticated and synced:', session.user.email);
            
            navigate(ROUTES.PROFILE);
          } catch (backendError) {
            console.error('Backend sync error:', backendError);
            // Even if backend fails, allow login but log error
            setError('Profile sync warning: ' + backendError.message);
            setTimeout(() => navigate(ROUTES.PROFILE), 2000);
          }
        } else {
          navigate(ROUTES.SIGNIN);
          console.error('CROUTES.SIGNIN:', error);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('An unexpected error occurred.');
        setTimeout(() => navigate(ROUTES.SIGNIN), 2000);
      }
    };

    handleCallback();
  }, [navigate, setUserProfile]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {error ? (
        <>
          <div style={{ fontSize: '48px', color: '#ff4444' }}>⚠️</div>
          <p style={{ color: '#ff4444', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
        </>
      ) : (
        <>
          <div style={{ 
            fontSize: '24px',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <p>Completing sign-in...</p>
          <p style={{ fontSize: '12px', color: '#888' }}>Syncing with backend...</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback;