import React, { useState, useEffect } from "react";
import { supabase } from '../utils/supabase';
import PlanCard from "../components/PlanCard";
import SubscriptionHeader from "../components/SubscriptionHeader";
import useSubscriptionPlans from "../hooks/useSubscriptionPlans";
import { useUserRole } from "../services/Redirect";
import '../styles/BuyerSubscriptionPage.css';

const BuyerSubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('month');
  const [role, setRole] = useUserRole();
  const { plans: plansData, loading } = useSubscriptionPlans(role);

  if (loading) {
    return <div className="loading">Loading plans...</div>;
  }

  return (
    <div className="subscription-container">
        <SubscriptionHeader billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <div className="plan-cards">
        {plansData.map((plan, index) => (
            <PlanCard key={index} plan={plan} billingCycle={billingCycle} />
        ))}
        </div>
    </div>
  );

};

export default BuyerSubscriptionPage;