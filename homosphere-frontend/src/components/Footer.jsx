export default function Footer() {
  return (
    <footer className="bg-stone-100 w-full border-t border-stone-200/15 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 py-16">
        <div className="space-y-6">
          <div className="text-xl font-bold text-emerald-900 font-headline">Horizon Realty</div>
          <p className="text-stone-500 font-body text-sm leading-relaxed">
            Crafting extraordinary living experiences through curated real estate collections and architectural excellence.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-stone-400 hover:text-emerald-500 cursor-pointer">public</span>
            <span className="material-symbols-outlined text-stone-400 hover:text-emerald-500 cursor-pointer">share</span>
            <span className="material-symbols-outlined text-stone-400 hover:text-emerald-500 cursor-pointer">chat</span>
          </div>
        </div>
        <div>
          <h5 className="text-emerald-900 font-semibold mb-6 font-headline">Company</h5>
          <ul className="space-y-4 text-stone-500 font-body text-sm">
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">About Us</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Careers</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Contact</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Press</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-900 font-semibold mb-6 font-headline">Explore</h5>
          <ul className="space-y-4 text-stone-500 font-body text-sm">
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Neighborhoods</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Market Reports</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Buying Guide</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Selling Guide</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-emerald-900 font-semibold mb-6 font-headline">Legal</h5>
          <ul className="space-y-4 text-stone-500 font-body text-sm">
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Terms of Use</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Accessibility</a></li>
            <li><a className="hover:underline decoration-emerald-500/50 transition-all opacity-80 hover:opacity-100" href="#">Ad Choice</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-stone-200/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-stone-500 font-body text-sm">© 2024 Horizon Realty. All rights reserved.</span>
        <div className="flex gap-8">
          <a className="text-stone-500 text-xs hover:text-emerald-700 font-body" href="#">Privacy Policy</a>
          <a className="text-stone-500 text-xs hover:text-emerald-700 font-body" href="#">Terms of Use</a>
          <a className="text-stone-500 text-xs hover:text-emerald-700 font-body" href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
