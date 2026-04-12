import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function SignIn() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden bg-surface py-12">
        {/* Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary-container/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[50%] bg-secondary-fixed/30 rounded-full blur-[100px]"></div>
        
        {/* Back Link */}
        <Link className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group z-20" to="/">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-semibold">Back to Horizon Home</span>
        </Link>

        <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch min-h-[700px] z-10 p-4 relative">
          {/* Branding Column */}
          <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-primary rounded-l-xl relative overflow-hidden">
            <div className="z-10">
              <span className="text-white font-headline text-2xl font-black tracking-tight">Horizon Realty</span>
              <h1 className="text-white font-headline text-5xl font-extrabold mt-24 leading-tight">
                Your gateway to the <br/><span className="text-primary-fixed">Curated Horizon.</span>
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
              <div className="w-px h-10 bg-white/20 self-center"></div>
              <div className="flex flex-col">
                <span className="text-white text-3xl font-bold">98%</span>
                <span className="text-white/60 text-xs uppercase tracking-widest font-label">Satisfaction</span>
              </div>
            </div>
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <img className="w-full h-full object-cover" alt="Modern architectural interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_onOx1bPs2Mqa8p02pjKCgGVbFdV0vt486yWcVv1_dZQAzGpR61FWXX1fTuKYxKf2-jO7F3kAurIweBqZaQz8dASEsAsnGYlVcUPCjeuzs5SmZvz020KCdpdC-VJFtdm1wfj-5nba9E7EibnyvXNbVFZ-KVk_xyZF5ZaW8rk_1ODh62nSHxcHptjRHQR2s3nbCdGDg595RHqAKIGF3L67QFsPyUtHNWzUUQou-Ms07n7UD9ENu_GKDZvJuDCuzNkEkUcTUQqC2Ezx"/>
            </div>
          </div>

          {/* Interaction Column */}
          <div className="w-full md:w-1/2 bg-surface-container-lowest rounded-xl md:rounded-l-none md:rounded-r-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <div className="md:hidden mb-6 flex justify-center">
                <span className="text-primary font-headline text-2xl font-black tracking-tight">Horizon Realty</span>
              </div>
              <h2 className="text-3xl font-headline font-bold text-on-surface">Welcome Back</h2>
              <p className="text-on-surface-variant mt-2">Enter your credentials to access your curated listings.</p>
            </div>

            {/* Auth Toggle */}
            <div className="flex p-1 bg-surface-container-low rounded-full mb-8">
              <button className="flex-1 py-2 px-4 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-sm shadow-[0px_12px_32px_rgba(26,27,31,0.06)] transition-all">Sign In</button>
              <Link to="/signup" className="flex-1 py-2 px-4 rounded-full text-on-secondary-fixed-variant font-medium text-sm hover:bg-surface-container transition-all text-center">New Account</Link>
            </div>

            {/* Form Section */}
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider font-label" htmlFor="email">Email Address</label>
                <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" id="email" placeholder="hello@curated.com" type="email"/>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider font-label" htmlFor="password">Password</label>
                  <a className="text-xs font-semibold text-primary hover:underline" href="#">Forgot?</a>
                </div>
                <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" id="password" placeholder="••••••••" type="password"/>
              </div>
              <button className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="button">
                <span>Sign In to Horizon</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-surface-container-lowest px-4 text-on-surface-variant font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-outline-variant/15 border-2 text-on-surface-variant font-medium hover:bg-surface-container-low transition-all">
                <img alt="Google" className="w-5 h-5 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhwZ8wtLMnvkCtJa276bvEosT21ZGMdX-rhd_M_lTvSuY5XJvz3sw3U4CK0MhXMkSJak6a4smwlRtYTiwKm6HiMTWjzeEmX2g8IwTN4B0gyYBXNZtqfJrJBkyvVr4R356CCVpJpH2zOqtfY1D8tRPh7vAZUMVzVCzP029EozJad9Y59ezCfydC80N8p2SfKeEbKC-dsgvP4MG_PPqSPeMM18e3ENdT_gIjpkVQiOpT5xLf0nF1XIQcudueGGN0ZXvFyCvIU2xa2Scv"/>
                <span className="text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-outline-variant/15 border-2 text-on-surface-variant font-medium hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-xl text-on-surface-variant">ios</span>
                <span className="text-sm">Apple</span>
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-on-surface-variant">
                By continuing, you agree to our{' '}
                <a className="text-primary font-medium hover:underline" href="#">Terms of Service</a>{' '}
                and{' '}
                <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
