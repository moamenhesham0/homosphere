import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseUser } from '../../context/supabaseContext';
import { clearAuthSession } from '../../services';
import { ROUTES } from '../../constants/routes';
export default function AdminHeader({
  searchQuery,
  onSearchQueryChange,
  onSearch,
}) {
  const navigate = useNavigate();
  const { signOut } = useSupabaseUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error('Supabase sign-out failed:', error);
    } finally {
      clearAuthSession();
      setIsLoggingOut(false);
      navigate(ROUTES.SIGNIN);
    }
  };
  return (
    <header className="sticky top-0 h-16 bg-white/60 backdrop-blur-md flex items-center justify-between px-8 w-full border-b border-gray-100 z-40 font-headline text-base">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-[#476738]/20 focus:bg-surface-container-lowest transition-all text-sm font-body"
            placeholder="Search directory..."
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSearch();
              }
            }}
          />
        </div>
        <button
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary"
          type="button"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      <div className="ml-4 flex items-center justify-end">
        <button
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <span className="material-symbols-outlined">logout</span>
          {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
}
