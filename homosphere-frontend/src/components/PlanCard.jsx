import React from 'react';

const PlanCard = ({ plan, billingCycle }) => {
    return (
        <div className={`plan-card ${plan.name.toLowerCase()}`}>
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
    );
};

export default PlanCard;