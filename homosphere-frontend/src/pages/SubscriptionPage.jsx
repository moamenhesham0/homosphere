import React, { useState } from "react";
import PlanCard from "../components/PlanCard";
import SubscriptionHeader from "../components/SubscriptionHeader";
import useSubscriptionPlans from "../hooks/useSubscriptionPlans";
import { useUserRole } from "../services/Redirect";
import useUserSubscription from "../hooks/useUserSubscription";
import useSubscriptionActions from "../hooks/useSubscriptionActions";
import '../styles/SubscriptionPage.css';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('month');
  const [role, setRole] = useUserRole();
  const { plans: plansData, loading } = useSubscriptionPlans(role);
  const { currentSubscriptionId, setCurrentSubscriptionId, userId } = useUserSubscription();
  const { subscribe } = useSubscriptionActions();

  const currentPlan = plansData.find(p => p.id === currentSubscriptionId);
  const currentPriority = currentPlan?.priority || 0;

  const handleSelectPlan = (plan) => {
    subscribe(userId, plan, billingCycle, currentSubscriptionId, setCurrentSubscriptionId);
  };

  if (loading) {
    return <div className="loading">Loading plans...</div>;
  }

  return (
    <div className="subscription-container">
        <SubscriptionHeader billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <div className="plan-cards">
        {plansData.map((plan, index) => (
            <PlanCard 
                key={index} 
                plan={plan} 
                billingCycle={billingCycle} 
                currentSubscriptionId={currentSubscriptionId}
                currentPriority={currentPriority}
                onSelect={handleSelectPlan}
            />
        ))}
        </div>
    </div>
  );

};

export default SubscriptionPage;