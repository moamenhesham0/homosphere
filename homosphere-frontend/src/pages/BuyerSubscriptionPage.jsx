import React, { useState } from "react";
import './BuyerSubscriptionPage.css';

const BuyerSubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('month');

  const plans = [
    {
      name: 'Free Plan',
      price: [
        {month: '$0'},
        {year: '$0'}
      ],
      period: [
        {month: '/ month'},
        {year: '/ year'}
      ],
      buttonText: 'Get Free',
      features: [
        'Unlimited view of properties',
        '1 AI generated property report per month',
        'No AI Estimations',
        'No access to statistics',
        'Basic Contact Form Access'
      ],
    },
    {
      name: 'Standard Plan',
      price: [
        {month: '$999.99'},
        {year: '$9999.99'}
      ],
      period: [
        {month: '/ month'},
        {year: '/ year'}
      ],
      buttonText: 'Get Standard',
      isHot: true,
      features: [
        'Unlimited view of properties',
        '5 AI generated property reports per month',
        '5 AI Estimations',
        'Access to statistics',
        'Unlimited Contact Form Access'
      ],
    },
    {
      name: 'Premium Plan',
      price: [
        {month: '$1999.99'},
        {year: '$19999.99'}
      ],
      period: [
        {month: '/ month'},
        {year: '/ year'}
      ],
      buttonText: 'Get Premium',
      features: [
        'Unlimited view of properties',
        'Unlimited AI generated property reports',
        'Unlimited AI Estimations',
        'Access to statistics',
        'Unlimited Contact Form Access',
        { text: 'Access to AI variables insights', desc: 'Get detailed insights on various AI-generated variables to make informed decisions.' },
      ],
    },
  ];

  return (
    <div className="subscription-container">
        <div className="subscription-header">
            <h1>Select a plan</h1>
            <h3>To complete your account setup you need to choose a subscription plan</h3>
            <div className="toggle-container">
                <button 
                    className={`toggle-btn ${billingCycle === 'month' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('month')}
                >
                    Monthly
                </button>
                <button 
                    className={`toggle-btn ${billingCycle === 'year' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('year')}
                >
                    Yearly
                </button>
            </div>
        </div>

        <div className="plan-cards">
            {plans.map((plan, index) => (
                <div key={index} className={`plan-card ${plan.name.toLowerCase()}`}>
                    {plan.isHot && <span className="hot-badge">HOT</span>}
                    <h2 className="plan-name">{plan.name}</h2>
                    <div className="price-container">
                        <span className="plan-price">
                            {plan.price.find(p => p[billingCycle])?.[billingCycle]}
                        </span>
                        <span className="plan-period">
                            {plan.period.find(p => p[billingCycle])?.[billingCycle]}
                        </span>
                    </div>
                    <button className="select-plan-btn">
                        {plan.buttonText}
                    </button>

                    <ul className="plan-features">
                        {plan.features.map((feature, idx) => {
                          const featureText = typeof feature === 'string' ? feature : feature.text;
                          const featureDesc = typeof feature === 'string' ? null : feature.desc;
                          return (
                              <li key={idx} className="plan-feature">
                                  <span className="feature-icon">✧</span> {featureText}
                                  {featureDesc && <div className="tooltip-container">
                                      <span className="tooltip-icon"> ⓘ </span>
                                      <span className="tooltip-text">{featureDesc}</span>
                                  </div>}
                              </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    </div>
  );

};

export default BuyerSubscriptionPage;