import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "../components/PlanCard";
import SubscriptionHeader from "../components/SubscriptionHeader";
import useSubscriptionPlans from "../hooks/useSubscriptionPlans";
import { useUserRole } from "../services/Redirect";
import useUserSubscription from "../hooks/useUserSubscription";
import useSubscriptionActions from "../hooks/useSubscriptionActions";
import axios from 'axios';
import { supabase } from '../utils/supabase';
import '../styles/SubscriptionPage.css';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('month');
  const [role, setRole] = useUserRole();
  const { plans: plansData, loading } = useSubscriptionPlans(role);
  const { currentSubscriptionId, setCurrentSubscriptionId, userId } = useUserSubscription();
  const { subscribe } = useSubscriptionActions();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfFirstTime = async () => {
      if (userId && !currentSubscriptionId) {
        try {
          // Check if user exists in backend
          const response = await axios.get(`http://localhost:8080/api/public/signup/${userId}`);
          if (response.data === "Fail") {
            setIsFirstTime(true);
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setIsFirstTime(true);
        }
      }
    };
    checkIfFirstTime();
  }, [userId, currentSubscriptionId]);

  const currentPlan = plansData.find(p => p.id === currentSubscriptionId);
  const currentPriority = currentPlan?.priority || 0;

  const handleSelectPlan = async (plan) => {
    if (isSubmitting) return;
    
    const action = isFirstTime ? "subscribe" : (currentSubscriptionId ? 
      (plan.priority > currentPriority ? "upgrade" : "downgrade") : "subscribe");
    

    setIsSubmitting(true);
    const result = await subscribe(userId, plan, billingCycle, currentSubscriptionId, setCurrentSubscriptionId, isFirstTime);
    setIsSubmitting(false);
    
    if (result.success) {
      alert(result.message);
      if (isFirstTime) {
        setIsFirstTime(false);
        navigate('/profile');
      }
    } else {
      alert(result.error);
    }
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