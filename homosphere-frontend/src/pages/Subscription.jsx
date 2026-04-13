import { Link, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { useEffect, useState } from "react";
import { getAuthToken, paymentApi, subscriptionTierApi } from '../services';

export default function Subscription() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [paymentError, setPaymentError] = useState('');
  const [isRedirectingTier, setIsRedirectingTier] = useState('');

  useEffect(() => {
    subscriptionTierApi.getSellerSubscriptionTiers()
        .then(data => setTiers(data))
        .catch(err => console.error('Failed to fetch tiers:', err));
  }, []);

  const tier_1 = tiers.find(t => t.visibilityPriority === 1) || "";
  const tier_2 = tiers.find(t => t.visibilityPriority === 2) || "";
  const tier_3 = tiers.find(t => t.visibilityPriority === 3) || "";

  const tier_1_description = tier_1?.description?.split(",") || [];
  const tier_2_description = tier_2?.description?.split(",") || [];
  const tier_3_description = tier_3?.description?.split(",") || [];

  const handleGetStarted = async (tier) => {
    if (!tier?.name) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      navigate('/signin', { state: { from: '/subscription' } });
      return;
    }

    try {
      setPaymentError('');
      setIsRedirectingTier(tier.name);

      const response = await paymentApi.createOrder(
          {
            tierName: tier.name,
            tiertype: 'MONTHLY',
            currencyCode: 'USD',
          },
          token,
      );

      const orderId = response?.orderId;
      if (!orderId) {
        throw new Error('Could not start PayPal checkout (no order ID received).');
      }

      // Default to sandbox unless explicitly set to production
      const isProduction = (import.meta?.env?.VITE_PAYPAL_ENV || '').toLowerCase() === 'production';
      const paypalCheckoutUrl = isProduction
          ? 'https://www.paypal.com/checkoutnow'
          : 'https://www.sandbox.paypal.com/checkoutnow';

      console.log(`Redirecting to PayPal: ${paypalCheckoutUrl}?token=${orderId}`);
      window.location.href = `${paypalCheckoutUrl}?token=${encodeURIComponent(orderId)}`;
    } catch (error) {
      console.error('Failed to create PayPal order:', error);
      setPaymentError(error?.message || 'Failed to start checkout. Please try again.');
      setIsRedirectingTier('');
    }
  };

  return (
      <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
        <TopNavBar />

        <main className="pt-32 pb-24 flex-grow">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-8 mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-6 font-headline">Elevate your <span className="text-primary">real estate horizon.</span></h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed font-body">Choose the professional suite designed for modern agents. From basic listings to enterprise-grade market dominance.</p>
          </section>

          {/* Pricing Cards */}
          <section className="max-w-7xl mx-auto px-8 mb-24">
            {paymentError ? (
                <div className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container font-body">
                  {paymentError}
                </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Basic Plan */}
              <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col items-start transition-all hover:translate-y-[-4px]">
                <div className="text-sm font-bold text-secondary tracking-widest uppercase mb-4 font-body">{tier_1.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-on-surface font-headline">{tier_1.monthlyPrice}</span>
                  <span className="text-secondary font-body">/mo</span>
                </div>
                <p className="text-sm text-secondary mb-8 leading-relaxed font-body">{tier_1_description[0]}</p>
                <ul className="space-y-4 mb-10 w-full">
                  {tier_1_description.slice(1).map((item, index) => (
                      <li
                          key={index}
                          className="flex items-center gap-3 text-sm text-on-surface-variant font-body"
                      >
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                        {item}
                      </li>
                  ))}
                </ul>
                <button
                    onClick={() => handleGetStarted(tier_1)}
                    disabled={isRedirectingTier === tier_1?.name}
                    className="w-full mt-auto py-3 px-6 rounded-lg bg-secondary-container text-on-secondary-container font-bold hover:opacity-80 transition-all font-body disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRedirectingTier === tier_1?.name ? 'Redirecting...' : 'Get Started'}
                </button>
              </div>

              {/* Premier Agent */}
              <div className="relative bg-surface-container-lowest p-10 rounded-xl flex flex-col items-start border-2 border-primary-container transition-all hover:translate-y-[-4px] overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-4 py-1.5 text-xs font-black rounded-bl-xl tracking-tight font-body">MOST POPULAR</div>
                <div className="text-sm font-bold text-primary tracking-widest uppercase mb-4 font-body">{tier_2.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-on-surface font-headline">{tier_2.monthlyPrice}</span>
                  <span className="text-secondary font-body">/mo</span>
                </div>
                <p className="text-sm text-secondary mb-8 leading-relaxed font-body">{tier_2_description[0]}</p>
                <ul className="space-y-4 mb-10 w-full">
                  {tier_2_description.slice(1).map((item, index) => (
                      <li
                          key={index}
                          className="flex items-center gap-3 text-sm text-on-surface-variant font-body"
                      >
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                        {item}
                      </li>
                  ))}
                </ul>
                <button
                    onClick={() => handleGetStarted(tier_2)}
                    disabled={isRedirectingTier === tier_2?.name}
                    className="w-full mt-auto py-3 px-6 rounded-lg bg-primary-container text-on-primary-container font-bold hover:scale-105 transition-all shadow-md font-body disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRedirectingTier === tier_2?.name ? 'Redirecting...' : 'Get Started'}
                </button>
              </div>

              {/* Enterprise */}
              <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col items-start transition-all hover:translate-y-[-4px]">
                <div className="text-sm font-bold text-secondary tracking-widest uppercase mb-4 font-body">{tier_3.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-on-surface font-headline">{tier_3.monthlyPrice}</span>
                  <span className="text-secondary font-body">/mo</span>
                </div>
                <p className="text-sm text-secondary mb-8 leading-relaxed font-body">{tier_3_description[0]}</p>
                <ul className="space-y-4 mb-10 w-full">
                  {tier_3_description.slice(1).map((item, index) => (
                      <li
                          key={index}
                          className="flex items-center gap-3 text-sm text-on-surface-variant font-body"
                      >
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                        {item}
                      </li>
                  ))}
                </ul>
                <button
                    onClick={() => handleGetStarted(tier_3)}
                    disabled={isRedirectingTier === tier_3?.name}
                    className="w-full mt-auto py-3 px-6 rounded-lg bg-secondary text-on-secondary font-bold hover:opacity-90 transition-all font-body disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRedirectingTier === tier_3?.name ? 'Redirecting...' : 'Get Started'}
                </button>
              </div>
            </div>
          </section>

          {/* Feature Comparison */}
          <section className="max-w-5xl mx-auto px-8">
            <div className="bg-surface-container-low rounded-xl overflow-hidden p-8 md:p-12">
              <h3 className="text-3xl font-bold mb-10 text-on-surface font-headline">Detailed Feature Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body">
                  <thead>
                  <tr className="text-sm text-secondary border-b border-outline-variant/20">
                    <th className="py-4 font-bold">Feature</th>
                    <th className="py-4 px-4 font-bold">Basic</th>
                    <th className="py-4 px-4 font-bold text-primary">Premier</th>
                    <th className="py-4 px-4 font-bold">Enterprise</th>
                  </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-outline-variant/10">
                  <tr>
                    <td className="py-6 font-semibold">Active Listing Limit</td>
                    <td className="py-6 px-4">5 Properties</td>
                    <td className="py-6 px-4 text-primary font-medium">Unlimited</td>
                    <td className="py-6 px-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-semibold">Market Insights</td>
                    <td className="py-6 px-4">Daily Report</td>
                    <td className="py-6 px-4 text-primary font-medium">Real-time Dashboard</td>
                    <td className="py-6 px-4">Predictive Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-semibold">Lead Distribution</td>
                    <td className="py-6 px-4">Email Only</td>
                    <td className="py-6 px-4 text-primary font-medium">Instant Mobile Alerts</td>
                    <td className="py-6 px-4">Automated Routing</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-semibold">Listing Promotion</td>
                    <td className="py-6 px-4">Standard</td>
                    <td className="py-6 px-4 text-primary font-medium">Top of Search</td>
                    <td className="py-6 px-4">Multi-channel Sync</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-semibold">API Access</td>
                    <td className="py-6 px-4">
                      <span className="material-symbols-outlined text-secondary/30">close</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="material-symbols-outlined text-secondary/30">close</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="material-symbols-outlined text-primary">check</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-6 font-semibold">Customer Support</td>
                    <td className="py-6 px-4">Community Forum</td>
                    <td className="py-6 px-4 text-primary font-medium">24/7 Priority Support</td>
                    <td className="py-6 px-4">Dedicated Team</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="max-w-7xl mx-auto px-8 mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
                <img alt="Modern office interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ57GEP0NkIZrcTL2WX3yyHwd8-vWgeBzUY61bzT2cnnx7pY8T25imk4tlEB9kK3BoFtWW_3mQtQ_7O0kAu2hoRIbJFlU7EE1Poxjor_Pg_i5cuAbBXdXwTtCC0VakH2rohlQ9B_JEoJCCrpftkJ7ftfoXtn0ipSgFj5KROR40_6eZwM3IpqPkZ5HBtN4jcpCu6hefY0Ly6kvkHIL6_jpbvL8VWAc4q9AlXrhM8ejzk7vpLBlv-T7eLOSs63YBhdb-V1MTYkkImO2W"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6 text-on-surface font-headline">Built for the top 1% of Real Estate Professionals.</h2>
                <p className="text-secondary leading-relaxed mb-8 font-body">Horizon Realty isn't just a listing platform. It's an intelligence layer that connects high-intent buyers with the industry's most trusted agents. Our premium features are designed to maximize your efficiency and scale your business effortlessly.</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-black text-primary mb-1 font-headline">98%</div>
                    <div className="text-xs uppercase font-bold text-secondary tracking-widest font-body">Agent Retention</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-primary mb-1 font-headline">12M+</div>
                    <div className="text-xs uppercase font-bold text-secondary tracking-widest font-body">Monthly Leads</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
  );
}
