import axios from 'axios';

const useSubscriptionActions = () => {
  const subscribe = async (userId, plan, billingCycle, currentSubscriptionId, setCurrentSubscriptionId) => {
    if (!userId) {
        console.error("User ID not found");
        return;
    }

    if (!currentSubscriptionId) {
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

        try {
            await axios.post('http://localhost:8080/api/user-subscriptions', payload);
            setCurrentSubscriptionId(plan.id);
            alert(`Successfully subscribed to ${plan.name}!`);
        } catch (error) {
            console.error("Error creating subscription:", error);
            alert("Failed to create subscription. Please try again.");
        }
    } else {
        console.log("User already has a subscription. Upgrade/Downgrade logic needed.");
    }
  };

  return { subscribe };
};

export default useSubscriptionActions;
