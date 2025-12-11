import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.js';

export const useUserData = () => {
  const [role, setRole] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSubscriptionDetails = async (token) => {
      try {
        const response = await fetch(`http://localhost:8080/api/user-subscriptions/my-role-tier`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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
          await fetchSubscriptionDetails(session.access_token);
          setRole(user.user_metadata.role);
          setEmail(user.email);
          setFirstName(user.user_metadata.first_name);
          setLastName(user.user_metadata.last_name);
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
        setEmail(session.user.email);
        setFirstName(session.user.user_metadata.first_name);
        setLastName(session.user.user_metadata.last_name);
        fetchSubscriptionDetails(session.access_token);
      } else {
        setRole(null);
        setSubscriptionId(null);
        setEmail(null);
        setFirstName(null);
        setLastName(null);
      } 
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return [role, setRole, subscriptionId, setSubscriptionId, email, firstName, lastName];
};

export const useUserRole = () => {
  const [role, setRole, subscriptionId, setSubscriptionId, email, firstName, lastName] = useUserData();
  return [role, setRole];
};