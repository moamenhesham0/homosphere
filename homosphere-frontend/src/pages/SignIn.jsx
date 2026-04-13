import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { authApi, signInWithSupabase, userSubscriptionApi } from '../services';
import {ROUTES} from '../constants/routes';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

      if (!hasSubscriptionTier) {
         navigate(ROUTES.SUBSCRIPTION);
         return;
      }else {
        navigate(ROUTES.PROFILE);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden bg-surface py-12">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary-container/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[50%] bg-secondary-fixed/30 rounded-full blur-[100px]" />

        <Link className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group z-20" to="/">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-semibold">Back to Homosphere Home</span>
        </Link>

        <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch min-h-[700px] z-10 p-4 relative">
          <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-primary rounded-l-xl relative overflow-hidden">
            <div className="z-10">
              <span className="text-white font-headline text-2xl font-black tracking-tight">Homosphere</span>
              <h1 className="text-white font-headline text-5xl font-extrabold mt-24 leading-tight">
                Your gateway to<br /><span className="text-primary-fixed">Homosphere.</span>
              </h1>
              <p className="text-white/80 mt-6 max-w-sm font-body leading-relaxed">
                Experience a sophisticated approach to finding your next home. Every detail, curated for excellence.
              </p>
            </div>

            <div className="z-10 flex gap-4 mt-auto">
              <div className="flex flex-col">
                <span className="text-white text-3xl font-bold">12k+</span>
                <span className="text-white/60 text-xs uppercase tracking-widest font-label">Properties</span>
              </div>
              <div className="w-px h-10 bg-white/20 self-center" />
              <div className="flex flex-col">
                <span className="text-white text-3xl font-bold">98%</span>
                <span className="text-white/60 text-xs uppercase tracking-widest font-label">Satisfaction</span>
              </div>
            </div>

            <div className="absolute inset-0 opacity-20">
              <img
                className="w-full h-full object-cover"
                alt="Modern architectural interior with clean lines, large windows, and soft natural sunlight filtering through thin curtains"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_onOx1bPs2Mqa8p02pjKCgGVbFdV0vt486yWcVv1_dZQAzGpR61FWXX1fTuKYxKf2-jO7F3kAurIweBqZaQz8dASEsAsnGYlVcUPCjeuzs5SmZvz020KCdpdC-VJFtdm1wfj-5nba9E7EibnyvXNbVFZ-KVk_xyZF5ZaW8rk_1ODh62nSHxcHptjRHQR2s3nbCdGDg595RHqAKIGF3L67QFsPyUtHNWzUUQou-Ms07n7UD9ENu_GKDZvJuDCuzNkEkUcTUQqC2Ezx"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-surface-container-lowest rounded-xl md:rounded-l-none md:rounded-r-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-headline font-bold text-on-surface">Welcome Back</h2>
            </div>

            {errorMessage && (
              <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
                {errorMessage}
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider font-label" htmlFor="email">Email Address</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="email"
                  placeholder="hello@curated.com"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-label" htmlFor="password">Password</label>
                <input
                  className="w-full mt-1.5 bg-surface-container-high border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
              <button className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Horizon'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                Need an account?
                <Link to="/signup" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
