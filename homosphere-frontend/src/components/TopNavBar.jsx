import { Link } from 'react-router-dom';

export default function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="flex items-center gap-12">
          <Link className="text-2xl font-black text-emerald-900 dark:text-emerald-50 tracking-tight font-headline" to="/">Horizon Realty</Link>
          <div className="hidden md:flex gap-8">
            <a className="font-headline font-bold tracking-tight text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-700 pb-1 hover:text-emerald-500 transition-colors duration-200" href="#">Buy</a>
            <a className="font-headline font-bold tracking-tight text-stone-600 dark:text-stone-400 hover:text-emerald-500 transition-colors duration-200" href="#">Rent</a>
            <Link className="font-headline font-bold tracking-tight text-stone-600 dark:text-stone-400 hover:text-emerald-500 transition-colors duration-200" to="/create-property">Sell</Link>
            <a className="font-headline font-bold tracking-tight text-stone-600 dark:text-stone-400 hover:text-emerald-500 transition-colors duration-200" href="#">Home Loans</a>
            <a className="font-headline font-bold tracking-tight text-stone-600 dark:text-stone-400 hover:text-emerald-500 transition-colors duration-200" href="#">Agent Finder</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/signin" className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 duration-150 ease-in-out font-body">
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}
