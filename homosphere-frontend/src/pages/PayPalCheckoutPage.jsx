import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createPayPalOrder, capturePayPalOrder, getPayPalCheckoutUrl } from '../services/paymentApi';
import '../styles/PayPalCheckoutPage.css';

// PayPal Logo SVG Component
const PayPalLogo = ({ className = '' }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 124 33" 
        height="33" 
        width="124"
    >
        <path 
            fill="#253B80" 
            d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"
        />
        <path 
            fill="#179BD7" 
            d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"
        />
        <path 
            fill="#253B80" 
            d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"
        />
        <path 
            fill="#179BD7" 
            d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"
        />
        <path 
            fill="#222D65" 
            d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z"
        />
    </svg>
);

// Secure badge icon
const SecureIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const PayPalCheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    
    // Get plan data from navigation state or session storage (for return from PayPal)
    const getInitialPlanData = () => {
        if (location.state?.plan) {
            return location.state;
        }
        // Try to get from session storage (when returning from PayPal)
        const stored = sessionStorage.getItem('paypal_checkout_data');
        if (stored) {
            return JSON.parse(stored);
        }
        return { plan: null, billingCycle: null };
    };
    
    const { plan, billingCycle } = getInitialPlanData();
    
    const [status, setStatus] = useState('idle'); // idle, creating, pending, capturing, success, error
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    // Store plan data in session storage when available
    useEffect(() => {
        if (location.state?.plan) {
            sessionStorage.setItem('paypal_checkout_data', JSON.stringify({
                plan: location.state.plan,
                billingCycle: location.state.billingCycle
            }));
        }
    }, [location.state]);

    // Check for returning from PayPal (URL has token parameter)
    // This must run BEFORE the redirect check
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paypalToken = urlParams.get('token');
        const payerId = urlParams.get('PayerID');
        
        console.log('PayPal return check:', { paypalToken, payerId, authToken: token, plan });
        
        if (paypalToken && payerId && token) {
            // User returned from PayPal - capture the order
            console.log('Capturing order:', paypalToken);
            handleCaptureOrder(paypalToken);
        } else if (paypalToken && payerId && !token) {
            console.log('Waiting for auth token...');
        }
    }, [token]); // Added token dependency to ensure we have auth

    // Redirect if no plan data - but NOT if returning from PayPal
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paypalToken = urlParams.get('token');
        
        // Don't redirect if we're in the middle of capturing (returning from PayPal)
        if (!plan && !paypalToken) {
            navigate('/subscription');
        }
    }, [plan, navigate]);

    const getPrice = () => {
        if (!plan) return '0.00';
        const priceObj = plan.price.find(p => p[billingCycle]);
        return priceObj ? priceObj[billingCycle] : '0.00';
    };

    const getPeriod = () => {
        return billingCycle === 'month' ? 'Monthly' : 'Yearly';
    };

    const handleCreateOrder = async () => {
        if (!token) {
            setError('Please sign in to continue');
            return;
        }

        setStatus('creating');
        setError(null);

        try {
            const tierType = billingCycle === 'month' ? 'MONTHLY' : 'YEARLY';
            const result = await createPayPalOrder(plan.name, tierType, 'USD', token);
            
            setOrderId(result.orderId);
            setStatus('pending');
            
            // Redirect to PayPal for approval
            const checkoutUrl = getPayPalCheckoutUrl(result.orderId);
            window.location.href = checkoutUrl;
            
        } catch (err) {
            setStatus('error');
            setError(err.message || 'Failed to create payment order');
        }
    };

    const handleCaptureOrder = async (orderIdToCapture) => {
        setStatus('capturing');
        setError(null);

        try {
            const result = await capturePayPalOrder(orderIdToCapture, token);
            
            // Check for COMPLETED status (enum from backend)
            if (result.status === 'COMPLETED' || result.status === 'completed') {
                setStatus('success');
                setPaymentDetails(result);
                // Clean up session storage
                sessionStorage.removeItem('paypal_checkout_data');
            } else {
                setStatus('error');
                setError('Payment was not completed. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setError(err.message || 'Failed to complete payment');
        }
    };

    const handleBackToSubscriptions = () => {
        navigate('/subscription');
    };

    const handleGoToProfile = () => {
        // Force reload to refresh subscription data
        window.location.href = '/profile';
    };

    if (!plan) {
        return null;
    }

    return (
        <div className="paypal-checkout-container">
            <div className="paypal-checkout-card">
                {/* Header */}
                <div className="checkout-header">
                    <PayPalLogo className="paypal-logo" />
                    <h1>Secure Checkout</h1>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="order-details">
                        <div className="order-item">
                            <span className="item-name">{plan.name} Plan</span>
                            <span className="item-period">({getPeriod()})</span>
                        </div>
                        <div className="order-price">
                            <span className="price-label">Total:</span>
                            <span className="price-value">{getPrice()}</span>
                        </div>
                    </div>
                    
                    {/* Features Preview */}
                    <div className="features-preview">
                        <h3>What you'll get:</h3>
                        <ul>
                            {plan.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx}>
                                    <span className="check-icon">✓</span>
                                    {typeof feature === 'string' ? feature : feature.text}
                                </li>
                            ))}
                            {plan.features.length > 3 && (
                                <li className="more-features">
                                    +{plan.features.length - 3} more features
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="payment-section">
                    {status === 'idle' && (
                        <>
                            <button 
                                className="paypal-button"
                                onClick={handleCreateOrder}
                            >
                                <PayPalLogo className="button-logo" />
                                <span>Pay with PayPal</span>
                            </button>
                            <div className="secure-notice">
                                <SecureIcon />
                                <span>Secure payment powered by PayPal</span>
                            </div>
                        </>
                    )}

                    {status === 'creating' && (
                        <div className="status-message loading">
                            <div className="spinner"></div>
                            <p>Creating your order...</p>
                        </div>
                    )}

                    {status === 'pending' && (
                        <div className="status-message loading">
                            <div className="spinner"></div>
                            <p>Redirecting to PayPal...</p>
                        </div>
                    )}

                    {status === 'capturing' && (
                        <div className="status-message loading">
                            <div className="spinner"></div>
                            <p>Completing your payment...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="status-message success">
                            <div className="success-icon">✓</div>
                            <h3>Payment Successful!</h3>
                            <p>Thank you for subscribing to the {plan.name} plan.</p>
                            <p className="order-id">Order ID: {paymentDetails?.orderId}</p>
                            <button 
                                className="continue-button"
                                onClick={handleGoToProfile}
                            >
                                Go to Profile
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-message error">
                            <div className="error-icon">✕</div>
                            <h3>Payment Failed</h3>
                            <p>{error}</p>
                            <div className="error-actions">
                                <button 
                                    className="retry-button"
                                    onClick={() => setStatus('idle')}
                                >
                                    Try Again
                                </button>
                                <button 
                                    className="back-button"
                                    onClick={handleBackToSubscriptions}
                                >
                                    Back to Plans
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {status === 'idle' && (
                    <div className="checkout-footer">
                        <button 
                            className="cancel-link"
                            onClick={handleBackToSubscriptions}
                        >
                            ← Back to subscription plans
                        </button>
                    </div>
                )}
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
                <div className="badge">
                    <SecureIcon />
                    <span>256-bit SSL Encryption</span>
                </div>
                <div className="badge">
                    <span>🛡️</span>
                    <span>Buyer Protection</span>
                </div>
                <div className="badge">
                    <span>💳</span>
                    <span>Secure Payments</span>
                </div>
            </div>
        </div>
    );
};

export default PayPalCheckoutPage;
