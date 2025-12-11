import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/SubscriptionAnalyticsWidget.css';
import {fetchUserSubscriptionAnalytics} from '../services/analyticsApi';
import { 
    BarChart,
    Bar,
    ResponsiveContainer, 
    Tooltip,
    XAxis,
    YAxis,
    Cell
} from 'recharts';

const SubscriptionAnalyticsWidget = () => {
    const { token } = useAuth();
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSubscriptionData = async () => {
            if (!token) return;

            try {
                setLoading(true);
                // Fetch real data from backend
                const userSubscriptionAnalytics = await fetchUserSubscriptionAnalytics(token);
                
                // Transform backend data to include features array for the UI
                const transformedData = {
                    ...userSubscriptionAnalytics,
                    features: [
                        { 
                            name: 'Property Listings', 
                            current: userSubscriptionAnalytics.propertiesListed, 
                            limit: userSubscriptionAnalytics.propertiesLimit 
                        },
                        { name: 'Featured Listings', current: 0, limit: 5 },
                        { name: 'Analytics Reports', current: true, limit: true },
                        { name: 'Priority Support', current: true, limit: true }
                    ]
                };
                setSubscriptionData(transformedData);
            } catch (err) {
                setError('Failed to load subscription data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSubscriptionData();
    }, [token]);

    if (loading) {
        return (
            <div className='subscription-analytics-widget'>
                <div className="widget-header">
                    <h3>My Subscription</h3>
                </div>
                <p className="loading-text">Loading subscription details...</p>
            </div>
        );
    }

    if (error || !token) {
        return (
            <div className='subscription-analytics-widget'>
                <div className="widget-header">
                    <h3>My Subscription</h3>
                </div>
                <p className="error-text">
                    {error || 'Please sign in to view your subscription'}
                </p>
            </div>
        );
    }

    if (!subscriptionData) {
        return (
            <div className='subscription-analytics-widget'>
                <div className="widget-header">
                    <h3>My Subscription</h3>
                </div>
                <p className="no-data-text">No subscription found</p>
            </div>
        );
    }

    // Calculate usage percentage
    const usagePercentage = (subscriptionData.propertiesListed / subscriptionData.propertiesLimit) * 100;
    
    // Data for usage chart
    const usageData = subscriptionData.features
        .filter(f => typeof f.limit === 'number')
        .map(f => ({
            name: f.name,
            used: f.current,
            available: f.limit - f.current
        }));

    // Status badge color
    const statusColor = {
        'Active': '#99BC85',
        'Inactive': '#999',
        'Expired': '#d32f2f'
    }[subscriptionData.status] || '#999';

    return (
        <div className='subscription-analytics-widget'>
            {/* Header with Plan Info */}
            <div className="widget-header">
                <div className="header-left">
                    <h3>My Subscription</h3>
                    <p className="header-subtitle">Manage your plan and track usage</p>
                </div>
                <div className="header-right">
                    <span className="tier-badge">{subscriptionData.tier} Plan</span>
                    <span 
                        className="status-badge" 
                        style={{ backgroundColor: statusColor }}
                    >
                        {subscriptionData.status}
                    </span>
                </div>
            </div>

            {/* Quick Stats and Feature Usage Chart in one row */}
            <div className="top-metrics-row">
                <div className="quick-stats-container">
                    <div className="quick-stats">
                        <div className="quick-stat">
                            <div className="quick-stat-info">
                                <p className="quick-stat-label">Days Remaining</p>
                                <p className="quick-stat-value">{subscriptionData.daysRemaining}</p>
                            </div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-info">
                                <p className="quick-stat-label">Views This Month</p>
                                <p className="quick-stat-value">{subscriptionData.views.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-info">
                                <p className="quick-stat-label">Leads Generated</p>
                                <p className="quick-stat-value">{subscriptionData.leadsGenerated}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Usage Chart */}
                {usageData.length > 0 && (
                    <div className="chart-section">
                        <h4 className="chart-title">Feature Usage</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={usageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#99BC85"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis stroke="#99BC85" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#FCFAF6',
                                        border: '1px solid #E4EFE7',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="used" stackId="a" fill="#99BC85" />
                                <Bar dataKey="available" stackId="a" fill="#E4EFE7" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="main-content-grid">
                {/* Property Listings Usage */}
                <div className="usage-section">
                    <div className="usage-header">
                        <h4>Property Listings Usage</h4>
                        <span className="usage-count">
                            {subscriptionData.propertiesListed} / {subscriptionData.propertiesLimit}
                        </span>
                    </div>
                    <div className="usage-bar-container">
                        <div 
                            className="usage-bar-fill"
                            style={{ 
                                width: `${Math.min(usagePercentage, 100)}%`,
                                backgroundColor: usagePercentage > 90 ? '#d32f2f' : '#99BC85'
                            }}
                        />
                    </div>
                    <p className="usage-warning">
                        {usagePercentage > 90 
                            ? `Warning: You're using ${usagePercentage.toFixed(0)}% of your limit. Consider upgrading!`
                            : `${(subscriptionData.propertiesLimit - subscriptionData.propertiesListed)} listings available`
                        }
                    </p>
                </div>

                {/* Features List */}
                <div className="features-list">
                    <h4 className="section-title">Your Features</h4>
                    {subscriptionData.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <div className="feature-left">
                                <span className="feature-name">{feature.name}</span>
                            </div>
                            <div className="feature-right">
                                {typeof feature.limit === 'number' ? (
                                    <span className="feature-limit">
                                        {feature.current} / {feature.limit}
                                    </span>
                                ) : (
                                    <span className="feature-unlimited">Included</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Info and Action Buttons Side by Side */}
            <div className="bottom-row">
                <div className="payment-section">
                    <h4 className="section-title">Payment Details</h4>
                    <div className="payment-info">
                        <div className="payment-row">
                            <span className="payment-label">Billing Cycle:</span>
                            <span className="payment-value">{subscriptionData.paymentFrequency}</span>
                        </div>
                        <div className="payment-row">
                            <span className="payment-label">Amount:</span>
                            <span className="payment-value">${subscriptionData.paymentAmount}</span>
                        </div>
                        <div className="payment-row">
                            <span className="payment-label">Next Payment:</span>
                            <span className="payment-value">
                                {new Date(subscriptionData.nextPaymentDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="payment-row">
                            <span className="payment-label">Subscription Started:</span>
                            <span className="payment-value">
                                {new Date(subscriptionData.startDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionAnalyticsWidget;
