import { Link } from 'react-router-dom';
import { getAuthToken } from '../services';

export default function TopNavBar() {
  const isSignedIn = Boolean(getAuthToken());

  return (
    <header className="fixed top-0 w-full z-50 bg-stone-100 backdrop-blur-md">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="flex items-center gap-12">
          <Link className="text-2xl font-black text-emerald-900 tracking-tight font-headline" to="/">Homosphere</Link>
          <div className="hidden md:flex gap-8">
            <a className="font-headline font-bold tracking-tight text-emerald-700 border-b-2 border-emerald-700 pb-1 hover:text-emerald-500 transition-colors duration-200" href="#">Buy</a>
            <Link className="font-headline font-bold tracking-tight text-stone-600 hover:text-emerald-500 transition-colors duration-200" to="/create-property">Sell</Link>
            <a className="font-headline font-bold tracking-tight text-stone-600 hover:text-emerald-500 transition-colors duration-200" href="#">Agent Finder</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <Link
              to="/profile"
              className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 duration-150 ease-in-out font-body flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              Profile
            </Link>
          ) : (
            <Link to="/signin" className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 duration-150 ease-in-out font-body">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
