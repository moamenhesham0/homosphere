import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken, getCurrentUser, userSubscriptionApi } from '../services';

/**
 * Global checker for SELLER and BROKER roles.
 * If they don't have an active subscription, redirect to /subscription.
 */
const UserSubscriptionChecker = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const token = getAuthToken();
      const user = getCurrentUser();

      // 1. If not logged in (Guest), they can browse normally.
      if (!token || !user) {
        setIsLoading(false);
        setHasSubscription(true);
        return;
      }

      // 2. Only SELLER and BROKER roles are required to have a subscription.
      // BUYER and ADMIN roles are exempt.
      const role = (user.role || '').toUpperCase();
      const needsSubscription = role === 'SELLER' || role === 'BROKER';

      if (!needsSubscription) {
        setIsLoading(false);
        setHasSubscription(true);
        return;
      }

      // 3. Skip check for auth-related or public-facing utility paths to prevent loops.
      const bypassPaths = ['/subscription', '/paypal-checkout', '/signin', '/signup', '/profile'];
      if (bypassPaths.includes(location.pathname)) {
        setIsLoading(false);
        setHasSubscription(true);
        return;
      }

      try {
        const myTiers = await userSubscriptionApi.getMyRoleAndTier(token);
        const hasActiveSub = Array.isArray(myTiers) && myTiers.length > 0;
        setHasSubscription(hasActiveSub);
      } catch (error) {
        console.error('Failed to verify subscription status:', error);
        // Default to true on error to prevent blocking users due to network glitches
        setHasSubscription(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [location.pathname]);

  if (isLoading) {
    return null; 
  }

  if (!hasSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};

export default UserSubscriptionChecker;
