import React from 'react';

const PlanCard = ({ plan, billingCycle, currentSubscriptionId, currentPriority, onSelect }) => {
    let buttonText = plan.buttonText;
    let isCurrent = false;
    let buttonClass = '';

    if (currentSubscriptionId) {
        if (plan.id === currentSubscriptionId) {
            buttonText = "Current Plan";
            isCurrent = true;
        } else if (plan.priority > currentPriority) {
            buttonText = "Upgrade";
            buttonClass = 'upgrade-btn';
        } else {
            buttonText = "Downgrade";
            buttonClass = 'downgrade-btn';
        }
    }

    const handleSelect = () => {
        if (isCurrent) return;
        
        let action = "subscribe";
        if (currentSubscriptionId) {
             if (plan.priority > currentPriority) action = "upgrade";
             else if (plan.priority < currentPriority) action = "downgrade";
        }
        
        if (window.confirm(`Are you sure you want to ${action} to the ${plan.name} plan?`)) {
            if (onSelect) onSelect(plan);
        }
    };

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
            <button 
                className={`select-plan-btn ${isCurrent ? 'current-plan-btn' : buttonClass}`} 
                disabled={isCurrent}
                onClick={handleSelect}
            >
                {buttonText}
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