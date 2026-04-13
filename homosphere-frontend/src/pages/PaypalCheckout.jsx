import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuthToken, paymentApi } from '../services';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function PaypalCheckout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        const orderId = searchParams.get('token');
        const token = getAuthToken();

        if (!orderId) {
            setStatus('error');
            setError('Missing order information.');
            return;
        }

        if (!token) {
            // If token is missing, redirect to signin but remember where we were
            navigate('/signin', { state: { from: `/paypal-checkout?token=${orderId}` } });
            return;
        }

        const capturePayment = async () => {
            try {
                const response = await paymentApi.captureOrder(orderId, token);
                if (response.status === 'COMPLETED') {
                    setStatus('success');
                    // Optional: Update user local state/context if needed
                    setTimeout(() => {
                        navigate('/profile');
                    }, 3000);
                } else {
                    setStatus('error');
                    setError('Payment was not completed. Status: ' + response.status);
                }
            } catch (err) {
                console.error('Capture failed:', err);
                setStatus('error');
                setError(err.message || 'Failed to capture payment.');
            }
        };

        capturePayment();
    }, [searchParams, navigate]);

    return (
        <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
            <TopNavBar />
            <main className="pt-32 pb-24 flex-grow flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-8 text-center">
                    {status === 'processing' && (
                        <div className="space-y-6">
                            <div className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <h1 className="text-3xl font-bold text-on-surface font-headline">Processing Payment</h1>
                            <p className="text-secondary font-body">Please wait while we confirm your transaction with PayPal.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
                            <h1 className="text-3xl font-bold text-on-surface font-headline">Payment Successful!</h1>
                            <p className="text-secondary font-body">Thank you for your subscription. Your account has been upgraded.</p>
                            <p className="text-sm text-secondary font-body italic">Redirecting to your profile...</p>
                            <button 
                                onClick={() => navigate('/profile')}
                                className="w-full py-3 px-6 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-all font-body"
                            >
                                Go to Profile
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <span className="material-symbols-outlined text-red-500 text-6xl">error</span>
                            <h1 className="text-3xl font-bold text-on-surface font-headline">Payment Failed</h1>
                            <p className="text-secondary font-body">{error}</p>
                            <button 
                                onClick={() => navigate('/subscription')}
                                className="w-full py-3 px-6 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-all font-body"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
