import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../utils/supabase';

const useUserSubscription = () => {
    const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

      useEffect(() => {
    const fetchUserSubscription = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            try {
                const fetchedUserId = session.user.id;
                setUserId(fetchedUserId);

                const subRes = await axios.get(`http://localhost:8080/api/user-subscriptions/user/${fetchedUserId}/role-tier`);
                if (subRes.data && subRes.data.length > 0) {
                    console.log("User subscription data:", subRes.data);
                    setCurrentSubscriptionId(subRes.data[0].subscriptionTierId);
                    setRole(subRes.data[0].role);
                }
            } catch (error) {
                console.error("Error fetching user subscription:", error);
            }
        }
    };
    fetchUserSubscription();
  }, []);
    return { currentSubscriptionId, setCurrentSubscriptionId, role, userId };
}
export default useUserSubscription;