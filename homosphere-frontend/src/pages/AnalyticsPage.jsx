import { useState } from 'react';
import FunnelWidget from '../components/FunnelWidget';
import SubscriptionAnalyticsWidget from '../components/SubscriptionAnalyticsWidget';
import '../styles/AnalyticsPage.css';

const AnalyticsPage = () => {
    const [activeTab, setActiveTab] = useState('subscription');

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h1>Analytics Dashboard</h1>
                <p>Track your subscription and property performance</p>
            </div>
            
            <div className="analytics-tabs">
                <button 
                    className={`analytics-tab ${activeTab === 'subscription' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subscription')}
                >
                    Subscription Analytics
                </button>
                <button 
                    className={`analytics-tab ${activeTab === 'property' ? 'active' : ''}`}
                    onClick={() => setActiveTab('property')}
                >
                    Property Performance
                </button>
            </div>

            <div className="analytics-content">
                {activeTab === 'subscription' && <SubscriptionAnalyticsWidget />}
                {activeTab === 'property' && <FunnelWidget />}
            </div>
        </div>
    );
};

export default AnalyticsPage;
