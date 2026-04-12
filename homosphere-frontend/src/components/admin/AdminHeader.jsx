export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-10 h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-stone-200">
      <div className="flex items-center gap-8">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-green-800">Approvals Portal</h2>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</span>
          <input className="pl-10 pr-4 py-2 bg-stone-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none" placeholder="Search listings..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 mr-4 font-body">
          <a className="text-green-800 border-b-2 border-green-800 pb-1 font-medium" href="#">Queue</a>
          <a className="text-stone-600 font-medium hover:text-green-700 transition-all" href="#">History</a>
          <a className="text-stone-600 font-medium hover:text-green-700 transition-all" href="#">Guidelines</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 text-stone-600 hover:bg-stone-100 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">mail</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-stone-200 overflow-hidden ml-2">
            <img alt="Administrator avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4S1-S-KRozHgh6Z7wdi0jgm41OlWNIWEBZJBb_2lDulnYdisZ4L45MSdeZdHc6LLEDbjAywG6bJH8BgaQ7nC8LQ-yHt0I5uTgBZuwjo1nGbA7Um1Nzr6KE_GcEYtBYHOSOB424qu7qlDWP5j10wKf2jH4ImkkhBTIuBguL_krqG1C4WXmnzsVlw4D_ZN8B4yaDIthovXdbFx-IK4EMfULcS2TGJ1IJVan_WoNFlVgyT099rgRNJcUlgArCaBOVdjRPhktuhXi0Fp8" />
          </div>
        </div>
      </div>
    </header>
  );
}
