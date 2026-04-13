import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseUser } from '../context/supabaseContext';
import { authApi, saveAuthSession, signUpWithSupabase } from '../services';
import { ROUTES } from '../constants/routes';

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
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { firstName, lastName } = splitName(formData.fullName);

    if (!firstName) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and confirm password do not match.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { accessToken, user: supabaseUser } = await signUpWithSupabase({
        email: formData.email.trim(),
        password: formData.password.trim(),
        lastName: lastName,
        firstName: firstName,
        role: formData.role,
        phone: formData.phone.trim(),
      });

      setSuccessMessage('Account created successfully.');
      navigate(ROUTES.SIGNIN);
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row">
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

        <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-body">Fill in your details and sync with backend.</p>
            </div>

            {errorMessage && (
              <p className="mb-4 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="mb-4 rounded-lg bg-primary-container px-4 py-3 text-sm text-on-primary-container">
                {successMessage}
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
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
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
                  id="name"
                  placeholder="Alex Sterling"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, fullName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
                  id="email"
                  placeholder="alex@horizon.com"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="phone">Phone Number</label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">Password</label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, password: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="confirm-password">Confirm Password</label>
                <input
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface"
                  id="confirm-password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                />
              </div>
              <div className="pt-4">
                <button className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
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
