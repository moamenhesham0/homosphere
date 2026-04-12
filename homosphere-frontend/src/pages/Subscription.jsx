import { useEffect, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { getAuthToken, paymentApi, subscriptionTierApi } from '../services';

function formatMoney(value) {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export default function Subscription() {
  const [tiers, setTiers] = useState([]);
  const [frequency, setFrequency] = useState('MONTHLY');
  const [isLoading, setIsLoading] = useState(false);
  const [isPayingTierId, setIsPayingTierId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTiers() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const payload = await subscriptionTierApi.getAllSubscriptionTiers();
        if (!isMounted) {
          return;
        }

        setTiers(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error.message || 'Failed to load subscription tiers.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTiers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateOrder = async (tier) => {
    setErrorMessage('');
    setSuccessMessage('');

    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to create a subscription payment order.');
      return;
    }

    setIsPayingTierId(tier.subscriptionId);

    try {
      const payload = await paymentApi.createOrder(
        {
          tierName: tier.name,
          tiertype: frequency,
          currencyCode: 'USD',
        },
        token,
      );

      setSuccessMessage(`Order created. PayPal Order ID: ${payload?.orderId || 'Unavailable'}`);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create payment order.');
    } finally {
      setIsPayingTierId(null);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-32 pb-24 flex-grow">
        <section className="max-w-7xl mx-auto px-8 mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-6 font-headline">
            Elevate your <span className="text-primary">real estate horizon.</span>
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed font-body">
            Choose a plan and create an order directly with backend payment APIs.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-full bg-surface-container-high p-1">
              <button
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold ${frequency === 'MONTHLY'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant'
                  }`}
                onClick={() => setFrequency('MONTHLY')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold ${frequency === 'YEARLY'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant'
                  }`}
                onClick={() => setFrequency('YEARLY')}
              >
                Yearly
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mb-6 rounded-lg bg-primary-container px-4 py-3 text-sm text-on-primary-container">
              {successMessage}
            </p>
          )}

          {isLoading ? (
            <p className="text-center text-on-surface-variant">Loading subscription tiers...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier) => {
                const currentPrice = frequency === 'MONTHLY' ? tier.monthlyPrice : tier.yearlyPrice;

                return (
                  <div
                    key={tier.subscriptionId}
                    className={`p-10 rounded-xl flex flex-col items-start transition-all hover:translate-y-[-4px] ${tier.popular
                        ? 'border-2 border-primary-container bg-primary-container/10'
                        : 'bg-stone-100'
                      }`}
                  >
                    <div className="text-sm font-bold text-secondary tracking-widest uppercase mb-4 font-body">
                      {tier.name}
                    </div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold text-on-surface font-headline">
                        {formatMoney(currentPrice)}
                      </span>
                      <span className="text-secondary font-body">
                        /{frequency === 'MONTHLY' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-8 leading-relaxed font-body">
                      {tier.description || 'Premium visibility and listing management tools.'}
                    </p>
                    <button
                      className="w-full mt-auto py-3 px-6 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-all font-body disabled:cursor-not-allowed disabled:opacity-60"
                      type="button"
                      onClick={() => handleCreateOrder(tier)}
                      disabled={isPayingTierId === tier.subscriptionId}
                    >
                      {isPayingTierId === tier.subscriptionId ? 'Creating Order...' : 'Choose Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

