import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseUser } from '../context/supabaseContext';
import { authApi, saveAuthSession, signUpWithSupabase } from '../services';
import { ROUTES } from '../constants/routes';
import InputField from '../components/forms/InputField';
import PasswordInput from '../components/forms/PasswordInput';
import PhoneInput from '../components/forms/PhoneInput';
import FeedbackModal from '../components/FeedbackModal';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

function splitName(fullName) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: rest.join(' ') || '-',
  };
}

export default function SignUp() {
  const navigate = useNavigate();
  const { syncAuthState } = useSupabaseUser();
  const [formData, setFormData] = useState({
    role: 'BUYER',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({ ...prev, phone: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name to continue.');
      return;
    }

    const { firstName, lastName } = splitName(formData.fullName);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g., alex@horizon.com).');
      return;
    }

    const unformattedPhone = formData.phone.replace(/\D/g, '');
    if (unformattedPhone.length < 10) {
      setErrorMessage('Please enter a complete 10-digit phone number.');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
    const isLongEnough = formData.password.length >= 8;

    if (!isLongEnough || !hasUpperCase || !hasNumbers || !hasSpecialChar) {
      setErrorMessage('Please ensure your password meets all the listed security requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('The passwords you entered do not match. Please check and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhone = `+1 ${formData.phone.trim()}`;
      const { accessToken, user: supabaseUser, errorMsg } = await signUpWithSupabase({
        email: formData.email.trim(),
        password: formData.password.trim(),
        lastName: lastName,
        firstName: firstName,
        role: formData.role,
        phone: fullPhone,
      });

      if(errorMsg) {
        setErrorMessage(errorMsg);
        return;
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate(ROUTES.SIGNIN);
      }, 2500);
    } catch (error) {
      console.log(error);
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <FeedbackModal
        isVisible={showSuccessModal}
        title="Welcome Aboard!"
        message="Your account has been created successfully. We are redirecting you to sign in..."
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
              alt="Modern architectural home with floor-to-ceiling glass windows at sunrise, soft warm morning light hitting a sage green garden landscape"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBKnWHVK3ymxOyiu-1_RnW-Y_AiGAEb_nH7y1bIIG7jsl2bfMBtWbkHyql5sdjCuHpMcF1soKIiqSqJd1vU8X63n6yhjrJX1tAdNUABhxjA9qQ4LAhv1GlNvRfiuYOUr8yX9zeqhfUUwbF5PxkVkZddvyr6C8P-WyPwDL_FN0wydDgiSHSrJDCoZmC0xEQakBNxoutHXguF34V2nR8evtzB1st9I7OBcaI7jHrd3JTElERz7rHGf0ppk3dD97-fxhFOd26bnW6v6Lh"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-primary-container/20" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-12">
              <span className="text-on-primary-fixed-variant font-headline font-bold text-2xl tracking-tight">Homosphere</span>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-primary leading-[1.1] mb-6">
              Join the <br />Curated Horizon
            </h1>

            <p className="text-on-primary/90 text-lg md:text-xl font-body max-w-md leading-relaxed">
              Create an account to start your journey into a world of architectural distinction and refined living.
            </p>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary-fixed"
                  alt="Close up portrait of a smiling professional woman with soft lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4QSRwr3xRurHSg7RqADC8wWNqsTuEqtrHM3Uc4L5he4468CtW0jzgV2zk7jn_0hEHbVculUeuwl3S4BK6zMzUUgdNCQx9RXVD0PQR18aVDpC74KahoG6ejegGT-bAm4k7HzcQpmvdCHf4PqKYR-EqPqLJ4oA14lknwGNMvLsv9xUdbND-d2brLDxyhvMfHTLXkUDO_50peWS0v8jRGsf-ZLyKAdrEUCIWvtb1rA08QO7Y7rbiMnyAjRTP_hH5bpyWWOBUtUqTZEQY"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary-fixed"
                  alt="Close up portrait of a businessman in a suit with blurred office background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf_CpSq3clJ9kbRsrSbSnkKcFjz0RYy7TMKSfEvtMEKgdprshdODxOMUzbrT6q0LQNtTUi8wcBsFw3GzS1VXmkWVRDbQtTN2peATaojRvF8wNxKQluv-ebLCFKRmfwN59hoiyLRTqzzwg2B6PGDkBdxtIaBkjI4EwccIqdp2UaAaM8sFFAFfmytEciI_BQdhaQ7OsMLdMburz1XnslNUjzf6SofJQFeMHeU6LdFPG4Uet4jx8WGOExp1F1pntta5GXYM76U8kyDryw"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary-fixed"
                  alt="Portrait of a young creative professional in a sunlit studio"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR5MHm1WseinIDOSK3a_lRerfU5fTpO7BnB8hIHTVr7CFYNty8BkH5X2R-vlzbzakXSzg94XDs7jMuCOLmeTJgEoanC9xOO2greBMuOTaefYWTelNOsP8bKsAPrAPXhSdivK50NqLTkQb4th6ZM2r7WZUioWuoDWn8wlmayXVUoQNMCXGDO2_FLxofiz5M8CyrqAlQbpFHsOreSMLv6N5RtS4OOWbxKCUUzw3FFCsIncHB6uJlNJzIr3VYKqhMDWcnwsY3EiITCv2u"
                />
              </div>
              <p className="text-on-primary/80 text-sm font-medium">Joined by 2,500+ discerning property owners</p>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col justify-center px-6 py-6 md:px-12 lg:px-16">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-1">Create Account</h2>
              <p className="text-on-surface-variant font-body text-sm">Fill in your details and sync with backend</p>
            </div>

            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#FFF0F0] border border-[#ffb4ab] px-4 py-3.5 text-sm text-[#ba1a1a] shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Account Type</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-high rounded-xl">
                  {['BUYER', 'SELLER', 'BROKER'].map((role) => (
                    <label key={role} className="cursor-pointer">
                      <input
                        className="sr-only peer"
                        name="account_type"
                        type="radio"
                        value={role}
                        checked={formData.role === role}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, role: event.target.value }))
                        }
                      />
                      <div className="flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant">
                        {role.charAt(0) + role.slice(1).toLowerCase()}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <InputField
                  label="Full Name"
                  id="fullName"
                  placeholder="Alex Sterling"
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  maxLength={80}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="alex@horizon.com"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  maxLength={254}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <PhoneInput
                  label="Phone Number"
                  id="phone"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={14}
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
                  maxLength={128}
                  required
                />
                <div className="pt-1.5 pl-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-2">
                  {[
                    { label: '8+ characters', met: formData.password.length >= 8 },
                    { label: 'Uppercase (e.g., A)', met: /[A-Z]/.test(formData.password) },
                    { label: 'Number (e.g., 1)', met: /\d/.test(formData.password) },
                    { label: 'Special (e.g., @)', met: /[^A-Za-z0-9]/.test(formData.password) },
                  ].map((req, idx) => (
                    <div key={idx} className={`flex items-center gap-1.5 text-[11px] transition-colors duration-300 ${req.met ? 'text-[#146c2e] font-medium' : 'text-on-surface-variant/70'}`}>
                      {req.met ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-current opacity-50 ml-1 mr-1" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <PasswordInput
                  label="Confirm Password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                  maxLength={128}
                  required
                />
              </div>
              <div className="pt-2">
                <button className="w-full py-3.5 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                Already have an account?
                <Link to="/signin" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2">Sign In</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}