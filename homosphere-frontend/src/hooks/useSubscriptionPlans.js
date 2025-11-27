import { useState, useEffect } from 'react';
import axios from 'axios';

const useSubscriptionPlans = (role) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) return;

    const fetchPlans = async () => {
      try {
        const apiRole = role === 'broker' ? 'seller' : role;
        console.log(`Fetching plans for role: ${apiRole}`);
        const response = await axios.get(`http://localhost:8080/api/subscription-tiers/${apiRole.toLowerCase()}-tiers`);
        console.log("Fetched plans:", response.data);
        
        const formattedPlans = response.data.map(plan => ({
            id: plan.subscriptionId,
            priority: plan.visibilityPriority,
            name: plan.name,
            isHot: plan.popular,
            buttonText: `Get ${plan.name}`,
            price: [
                { month: `$${plan.monthlyPrice}` },
                { year: `$${plan.yearlyPrice}` }
            ],
            period: [
                { month: '/ month' },
                { year: '/ year' }
            ],
            features: plan.features.map(f => ({
                text: f.name,
                desc: f.tooltip
            }))
        }));

        setPlans(formattedPlans);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [role]);

  return { plans, loading, error };
};

export default useSubscriptionPlans;
