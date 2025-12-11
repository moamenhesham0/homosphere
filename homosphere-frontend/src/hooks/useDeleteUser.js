import { useState } from 'react';
import { supabase } from '../utils/supabase';
import axios from 'axios';

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const userId = user.id;

      // Get JWT token from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Delete user from backend database (includes profile, subscriptions, and Supabase auth)
      // Send JWT token for authentication - backend will verify user is deleting their own account
      const backendResponse = await axios.delete(`http://localhost:8080/api/user`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (backendResponse.status !== 200) {
        throw new Error('Failed to delete user from backend');
      }

      // Sign out after deletion
    //   await supabase.auth.signOut();

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { deleteUser, loading, error };
};

export default useDeleteUser;
