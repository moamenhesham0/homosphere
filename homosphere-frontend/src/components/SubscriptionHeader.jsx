import React from 'react';

const SubscriptionHeader = ({ billingCycle, setBillingCycle }) => {
    return (
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
    );
};

export default SubscriptionHeader;