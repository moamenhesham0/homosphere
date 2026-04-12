import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Side: Inspirational Visuals */}
        <section className="relative w-full md:w-1/2 lg:w-3/5 min-h-[409px] md:min-h-screen bg-primary-container overflow-hidden flex items-center justify-center p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-80 mix-blend-multiply" alt="Modern architectural home with floor-to-ceiling glass windows at sunrise, soft warm morning light hitting a sage green garden landscape" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBKnWHVK3ymxOyiu-1_RnW-Y_AiGAEb_nH7y1bIIG7jsl2bfMBtWbkHyql5sdjCuHpMcF1soKIiqSqJd1vU8X63n6yhjrJX1tAdNUABhxjA9qQ4LAhv1GlNvRfiuYOUr8yX9zeqhfUUwbF5PxkVkZddvyr6C8P-WyPwDL_FN0wydDgiSHSrJDCoZmC0xEQakBNxoutHXguF34V2nR8evtzB1st9I7OBcaI7jHrd3JTElERz7rHGf0ppk3dD97-fxhFOd26bnW6v6Lh" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-primary-container/20"></div>
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="mb-12">
              <span className="text-on-primary-fixed-variant font-headline font-bold text-2xl tracking-tight">Horizon Realty</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-primary leading-[1.1] mb-6">
              Join the <br />Curated Horizon
            </h1>
            <p className="text-on-primary/90 text-lg md:text-xl font-body max-w-md leading-relaxed">
              Create an account to start your journey into a world of architectural distinction and refined living.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-primary-fixed" alt="Close up portrait of a smiling professional woman with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4QSRwr3xRurHSg7RqADC8wWNqsTuEqtrHM3Uc4L5he4468CtW0jzgV2zk7jn_0hEHbVculUeuwl3S4BK6zMzUUgdNCQx9RXVD0PQR18aVDpC74KahoG6ejegGT-bAm4k7HzcQpmvdCHf4PqKYR-EqPqLJ4oA14lknwGNMvLsv9xUdbND-d2brLDxyhvMfHTLXkUDO_50peWS0v8jRGsf-ZLyKAdrEUCIWvtb1rA08QO7Y7rbiMnyAjRTP_hH5bpyWWOBUtUqTZEQY" />
                <img className="w-10 h-10 rounded-full border-2 border-primary-fixed" alt="Close up portrait of a businessman in a suit with blurred office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf_CpSq3clJ9kbRsrSbSnkKcFjz0RYy7TMKSfEvtMEKgdprshdODxOMUzbrT6q0LQNtTUi8wcBsFw3GzS1VXmkWVRDbQtTN2peATaojRvF8wNxKQluv-ebLCFKRmfwN59hoiyLRTqzzwg2B6PGDkBdxtIaBkjI4EwccIqdp2UaAaM8sFFAFfmytEciI_BQdhaQ7OsMLdMburz1XnslNUjzf6SofJQFeMHeU6LdFPG4Uet4jx8WGOExp1F1pntta5GXYM76U8kyDryw" />
                <img className="w-10 h-10 rounded-full border-2 border-primary-fixed" alt="Portrait of a young creative professional in a sunlit studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR5MHm1WseinIDOSK3a_lRerfU5fTpO7BnB8hIHTVr7CFYNty8BkH5X2R-vlzbzakXSzg94XDs7jMuCOLmeTJgEoanC9xOO2greBMuOTaefYWTelNOsP8bKsAPrAPXhSdivK50NqLTkQb4th6ZM2r7WZUioWuoDWn8wlmayXVUoQNMCXGDO2_FLxofiz5M8CyrqAlQbpFHsOreSMLv6N5RtS4OOWbxKCUUzw3FFCsIncHB6uJlNJzIr3VYKqhMDWcnwsY3EiITCv2u" />
              </div>
              <p className="text-on-primary/80 text-sm font-medium">Joined by 2,500+ discerning property owners</p>
            </div>
          </div>
        </section>
        {/* Right Side: Sign Up Form */}
        <section className="w-full md:w-1/2 lg:w-2/5 bg-surface-container-lowest flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-body">Enter your details to discover exclusive properties.</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Account Type</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container-high rounded-xl">
                  <label className="cursor-pointer">
                    <input defaultChecked className="sr-only peer" name="account_type" type="radio" value="buyer" />
                    <div className="flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant">Buyer</div>
                  </label>
                  <label className="cursor-pointer">
                    <input className="sr-only peer" name="account_type" type="radio" value="seller" />
                    <div className="flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant">Seller</div>
                  </label>
                  <label className="cursor-pointer">
                    <input className="sr-only peer" name="account_type" type="radio" value="broker" />
                    <div className="flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant">Broker</div>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                <div className="relative group">
                  <input className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface" id="name" placeholder="Alex Sterling" type="text" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <input className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface" id="email" placeholder="alex@horizon.com" type="email" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="phone">Phone Number</label>
                <input className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface" id="phone" placeholder="+1 (555) 000-0000" type="tel" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface" id="password" placeholder="••••••••" type="password" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" type="button">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-on-surface-variant ml-1" htmlFor="confirm-password">Confirm Password</label>
                <div className="relative">
                  <input className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 font-body placeholder:text-outline/60 text-on-surface" id="confirm-password" placeholder="••••••••" type="password" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" type="button">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3 px-1 mt-2">
                <div className="relative flex items-center h-5">
                  <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-high" id="terms" type="checkbox" />
                </div>
                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                  I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>
                </label>
              </div>
              <div className="pt-4">
                <button className="w-full py-4 bg-primary text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300" type="submit">
                  Create Account
                </button>
              </div>
            </form>
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-container-lowest text-outline font-medium tracking-wider uppercase">Or continue with</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm font-semibold text-on-surface">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96 0-2.04-.68-3.32-.68-1.25 0-2.23.64-3.16.64-2.68 0-5.18-3.04-5.18-7.22 0-3.35 2.12-5.14 4.14-5.14 1.13 0 2.07.72 2.92.72.84 0 1.9-.76 3.12-.76 1.48 0 2.84.81 3.6 2.05-3.08 1.41-2.58 5.76.54 7.02-.68 1.83-1.74 3.37-2.66 3.37zm-3.32-15.6c0-2.07 1.71-3.68 3.56-3.68.22 2.3-2.14 4.09-3.56 3.68z" fill="currentColor"></path>
                </svg>
                <span className="text-sm font-semibold text-on-surface">Apple</span>
              </button>
            </div>
            <div className="mt-12 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                Already have an account?
                <Link to="/signin" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2">Sign In</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      {/* Simple Footer */}
      <footer className="w-full border-t border-stone-200/10 bg-stone-50 flex flex-col md:flex-row justify-between items-center px-12 py-8">
        <p className="font-inter text-xs tracking-wide text-stone-500">© 2024 Horizon Realty. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="font-inter text-xs tracking-wide text-stone-500 opacity-80 hover:opacity-100 transition-opacity hover:text-emerald-600" href="#">Terms of Service</a>
          <a className="font-inter text-xs tracking-wide text-stone-500 opacity-80 hover:opacity-100 transition-opacity hover:text-emerald-600" href="#">Privacy Policy</a>
          <a className="font-inter text-xs tracking-wide text-stone-500 opacity-80 hover:opacity-100 transition-opacity hover:text-emerald-600" href="#">Cookie Settings</a>
        </div>
      </footer>
    </div>
  );
}
