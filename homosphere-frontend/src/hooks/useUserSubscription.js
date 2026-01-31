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

                // Use the new payment endpoint that gets the latest subscription
                const subRes = await axios.get(`http://localhost:8080/api/payment/my-subscription`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (subRes.data && subRes.data.subscriptionTierId) {
                    console.log("User subscription data:", subRes.data);
                    setCurrentSubscriptionId(subRes.data.subscriptionTierId);
                    
                    // Fetch role from user endpoint
                    const roleRes = await axios.get(`http://localhost:8080/api/user-subscriptions/my-role-tier`, {
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (roleRes.data && roleRes.data.length > 0) {
                        setRole(roleRes.data[0].role);
                    }
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