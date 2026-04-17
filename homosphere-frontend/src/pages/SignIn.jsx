import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, signInWithSupabase, userSubscriptionApi } from '../services';
import {ROUTES} from '../constants/routes';
import InputField from '../components/forms/InputField';
import PasswordInput from '../components/forms/PasswordInput';
import FeedbackModal from '../components/FeedbackModal';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    if (!formData.password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { accessToken, user } = await signInWithSupabase({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Sync with backend for additional data
      console.log('Login complete onto Sync, access token:', accessToken, 'user:', user);
      await authApi.login(accessToken);
      
      const myTiers = await userSubscriptionApi.getMyRoleAndTier(accessToken);
      console.log('User role and tier:', myTiers);

      const hasSubscriptionTier = Array.isArray(myTiers) ? myTiers.length > 0 : Boolean(myTiers);

      setShowSuccessModal(true);

      setTimeout(() => {
        if (!hasSubscriptionTier) {
           navigate(ROUTES.SUBSCRIPTION);
        } else {
          navigate(ROUTES.PROFILE);
        }
      }, 2500);

    } catch (error) {
      setErrorMessage(error.message || 'Sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <FeedbackModal
        isVisible={showSuccessModal}
        title="Welcome Back!"
        message="You have successfully signed in. We are redirecting you..."
      />
      <main className="flex-grow flex flex-col md:flex-row relative">
        <Link className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors group z-50 drop-shadow-md" to="/">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold tracking-wide">Back to Homosphere Home</span>
        </Link>
        <section className="relative w-full md:w-1/2 lg:w-3/5 min-h-[409px] md:min-h-screen bg-primary-container overflow-hidden flex items-center justify-center p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              alt="Modern architectural interior with clean lines, large windows, and soft natural sunlight filtering through thin curtains"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_onOx1bPs2Mqa8p02pjKCgGVbFdV0vt486yWcVv1_dZQAzGpR61FWXX1fTuKYxKf2-jO7F3kAurIweBqZaQz8dASEsAsnGYlVcUPCjeuzs5SmZvz020KCdpdC-VJFtdm1wfj-5nba9E7EibnyvXNbVFZ-KVk_xyZF5ZaW8rk_1ODh62nSHxcHptjRHQR2s3nbCdGDg595RHqAKIGF3L67QFsPyUtHNWzUUQou-Ms07n7UD9ENu_GKDZvJuDCuzNkEkUcTUQqC2Ezx"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-primary-container/20" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-12">
              <span className="text-on-primary-fixed-variant font-headline font-bold text-2xl tracking-tight">Homosphere</span>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-primary leading-[1.1] mb-6">
              Your gateway to <br />Homosphere.
            </h1>

            <p className="text-on-primary/90 text-lg md:text-xl font-body max-w-md leading-relaxed">
              Experience a sophisticated approach to finding your next home. Every detail, curated for excellence.
            </p>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-on-primary text-3xl font-bold">12k+</span>
                <span className="text-on-primary/80 text-xs uppercase tracking-widest font-label">Properties</span>
              </div>
              <div className="w-px h-10 bg-on-primary/20" />
              <div className="flex flex-col">
                <span className="text-on-primary text-3xl font-bold">98%</span>
                <span className="text-on-primary/80 text-xs uppercase tracking-widest font-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant font-body">Sign in to your account</p>
            </div>

            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#FFF0F0] border border-[#ffb4ab] px-4 py-3.5 text-sm text-[#ba1a1a] shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="hello@curated.com"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <PasswordInput
                  label="Password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </div>
              <div className="pt-4">
                <button className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                Need an account?
                <Link to="/signup" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2">Sign Up</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
