import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';

export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSubscriptionDetails = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/user-subscriptions/user/${userId}/role-tier`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription data: ${response.status}`);
        }

        const payload = await response.json();
        if (!isMounted) {
          return false;
        }

        if (Array.isArray(payload) && payload.length > 0) {
          const { subscriptionTierId, role: subscriptionRole } = payload[0];
          setSubscriptionId(subscriptionTierId);
          setRole(subscriptionRole);
          return true;
        }

        setSubscriptionId(null);
        return false;
      } catch (error) {
        if (isMounted) {
          setSubscriptionId(null);
        }
        console.error("Error fetching subscription details:", error);
        return false;
      }
    };

    const validateSession = async () => {
      // 1. Check if we have a session in local storage
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // 2. Verify with the server that the user still exists (hasn't been deleted)
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("Found stale session for deleted user. Clearing...");
          await supabase.auth.signOut();
          if (isMounted) {
            setRole(null);
            setSubscriptionId(null);
          }
        } else {
          console.log("User validated:", user);
          if (isMounted) {
            setRole(user.user_metadata?.role ?? null);
          }
          await fetchSubscriptionDetails(user.id);
        }
      } else if (isMounted) {
        setRole(null);
        setSubscriptionId(null);
      }
    };

    validateSession();

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role ?? null;
        setRole(userRole);
        fetchSubscriptionDetails(session.user.id);
      } else {
        setRole(null);
        setSubscriptionId(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return [role, setRole, subscriptionId, setSubscriptionId];
};