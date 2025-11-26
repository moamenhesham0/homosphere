import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';

export const useUserRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      // 1. Check if we have a session in local storage
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // 2. Verify with the server that the user still exists (hasn't been deleted)
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("Found stale session for deleted user. Clearing...");
          await supabase.auth.signOut();
          setRole(null);
        } else {
          console.log("User validated:", user);
          setRole(user.user_metadata.role);
        }
      }
    };

    validateSession();

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata.role;
        setRole(userRole);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return [role, setRole];
};