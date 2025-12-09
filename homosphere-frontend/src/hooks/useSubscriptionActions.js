import axios from 'axios';
import { supabase } from '../utils/supabase';

const useSubscriptionActions = () => {
  const subscribe = async (userId, plan, billingCycle, currentSubscriptionId, setCurrentSubscriptionId, isFirstTime = false) => {
    if (!userId) {
        console.error("User ID not found");
        return { success: false, error: 'User ID not found' };
    }

    if (!currentSubscriptionId || isFirstTime) {
        try {
            // For first-time users, call the register API
            if (isFirstTime) {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                
                if (userError || !user) {
                    console.error('Error getting user:', userError);
                    throw new Error('User not authenticated');
                }

                const userData = {
                    id: user.id,
                    email: user.email,
                    firstName: user.user_metadata?.first_name || '',
                    lastName: user.user_metadata?.last_name || '',
                    role: user.user_metadata?.role || '',
                    password: '',
                    subscriptionTierId: plan.id,
                    billingCycle: billingCycle
                };

                await axios.post('http://localhost:8080/api/public/user', userData);
            } else {
                // For existing users without subscription, use the regular subscription API
                const startDate = new Date();
                const endDate = new Date(startDate);
                if (billingCycle === 'month') {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }

                const payload = {
                    user: { id: userId },
                    subscription: { subscriptionId: plan.id },
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    frequency: billingCycle === 'month' ? 'MONTHLY' : 'YEARLY',
                    status: 'ACTIVE'
                };

                await axios.post('http://localhost:8080/api/user-subscriptions', payload);
            }
            
            setCurrentSubscriptionId(plan.id);
            return { success: true, message: `Successfully subscribed to ${plan.name}!` };
        } catch (error) {
            console.error("Error creating subscription:", error);
            return { success: false, error: 'Failed to create subscription. Please try again.' };
        }
    } else {
        // User already has a subscription - upgrade or downgrade
        try {
            const startDate = new Date();
            const endDate = new Date(startDate);
            if (billingCycle === 'month') {
                endDate.setMonth(endDate.getMonth() + 1);
            } else {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            const updatePayload = {
                newSubscriptionTierId: plan.id,
                frequency: billingCycle === 'month' ? 'MONTHLY' : 'YEARLY',
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            };

            await axios.put(`http://localhost:8080/api/user-subscriptions/user/${userId}/update-tier`, updatePayload);
            setCurrentSubscriptionId(plan.id);
            return { success: true, message: `Successfully updated to ${plan.name}!` };
        } catch (error) {
            console.error("Error updating subscription:", error);
            return { success: false, error: 'Failed to update subscription. Please try again.' };
        }
    }
  };

  return { subscribe };
};

export default useSubscriptionActions;
