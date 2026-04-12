import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <TopNavBar />

      {/* Hero Section */}
      <section className="relative h-[870px] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Luxurious modern minimalist villa" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4uuH2br7qA5GRGZOOhQOCxN3qOkbMtFfrKQtRmS-obDJxVl7jxtlrpKDboukOqk908MsTQXxiw3vKCXoQUFxZqiho0CV_EqDvUam7uwZWkqisIckwgDokaylnrgfY8Wt_M3-ZK_HQt41hpWD75o_ck3nyuO0cSApTry1UYzX1q16Lru5mIYEY_amQUHICSVeEimguXQSW68USz5avBZxAzp9UVyFQ28qspeGp6K06nLfF9fEvgcVFrgTWFVat_kmfGZUUDDpb34js"/>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b1f66] to-[#1a1b1f1a]"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight font-headline">
            Agents to help you <br/> <span className="text-primary-container">find your horizon.</span>
          </h1>
          <div className="relative group">
            <div className="flex items-center bg-surface-container-lowest p-2 rounded-full shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/20">
              <div className="flex-1 px-6">
                <input className="w-full border-none focus:ring-0 bg-transparent text-on-surface py-4 text-lg font-medium placeholder:text-stone-400 outline-none font-body" placeholder="Enter an address, neighborhood, city, or ZIP code" type="text"/>
              </div>
              <Link to="/search" className="bg-primary text-on-primary p-4 rounded-full flex items-center justify-center hover:bg-surface-tint transition-all active:scale-95">
                <span className="material-symbols-outlined">search</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview Bento Grid */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block font-body">Market Pulse</span>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Navigating the New Market</h2>
            </div>
            <button className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 font-body">View Local Insights</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Large Feature Card */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-xl bg-surface-container-lowest transition-all hover:translate-y-[-4px]">
              <div className="flex flex-col md:flex-row h-full">
                <div className="p-10 md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4 text-on-surface font-headline">The Editorial Collection</h3>
                  <p className="text-on-surface-variant mb-8 leading-relaxed font-body">Discover homes hand-picked by our design curators for their architectural significance and unique character.</p>
                  <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-bold self-start hover:bg-primary-container/20 transition-colors font-body">Explore Selection</button>
                </div>
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img alt="High-end interior design" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqAR5ubkKZUeiER6sxANS1k_ylCewkP8M-zw3K-pnZQcq81EfDhlvvx4d304wgFyysVvIcMatjxIl1AOMm5ZTyj--aKtDALcQzLvbWO7bCbBsQR98gilfQihyTyjE7P3vce2yxjFjOiMshDkKbGMwizYqQeELcutIdydb1YIpvIOCGXBJSAhYO6yINQpck9j8C9nk75jjYNEhotUKSEKP5aMpDYPIiB73tisZgllsjB70HdCJuJMCSq9oXY_V0GF-j83zJ9kUnvjAJ"/>
                </div>
              </div>
            </div>
            {/* Vertical Stats Card */}
            <div className="bg-primary-container p-10 rounded-xl flex flex-col justify-between text-on-primary-container">
              <div>
                <span className="material-symbols-outlined text-4xl mb-6">trending_up</span>
                <h3 className="text-2xl font-bold mb-2 font-headline">Market Trends</h3>
                <p className="opacity-80 font-body">Home values in Horizon Preferred zip codes are up 4.2% YoY.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-on-primary-container/10">
                <div className="text-4xl font-black font-headline">$842k</div>
                <div className="text-sm font-medium opacity-70 font-body">Median Listing Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Featured Listings</h2>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Property Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6">
                <img alt="Contemporary white stucco residence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-qIZ0O6QSFRpzwHNzmrnx9F9blO_auzgyKXQYsfYJ11tTfr0wI2_dG01RMC2Y-yGNQ1qjCyeOPiNlb6Xwq6m1aKGNAsse63LS6YBY1FxIIu6XijG5RkldJ9JUiGi8SKcR-NuYhR_1Qin4zJkTojGASQsX-c_1lkRV90EzpHPF8APbtLP0S2dY2BJUqjuPIX2bvmzBZ-6aM_7fr8-obOBGpAVN_0IKaKW6lM5i6kFG3b-LleGd5-5sEG2hKEIAJvPnTNSGN8ZJ3-eC"/>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-on-surface uppercase tracking-widest font-body">New Construction</span>
                </div>
                <button className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-on-surface font-headline">$2,450,000</h3>
                <p className="font-medium text-on-surface-variant font-body">4 bds | 3 ba | 3,200 sqft</p>
                <p className="text-stone-500 text-sm font-body">882 Skyline Drive, West Haven, CA</p>
              </div>
            </div>
            {/* Property Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6">
                <img alt="Charming mid-century modern home" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCurTpLyurfFcDf8o8uXp7RicooCuqV6_l3t0utLp0uF5Nwdre-QtUCq0kd8nj72Ft6MBZawMy1s39ln5vW0rNBtbyJNLB4tSa91pBLXBScxXba2o6tiEDsrTFboEBBV-_DlQc_I8yhBAY9_JCqzoRei96fzDIkxpEYgY7Zf57pEUlgbJNOIc79DL4NOOHcvVNJT7RcUoQ4iN-qdD8x4bOxTbJTW2WaDrNYHrQGNLCpYMIZUxVqC4TGoLcscgjAkfdsB6B2uiO791Th"/>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-body">Open House: Sat</span>
                </div>
                <button className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-on-surface font-headline">$1,195,000</h3>
                <p className="font-medium text-on-surface-variant font-body">3 bds | 2 ba | 2,150 sqft</p>
                <p className="text-stone-500 text-sm font-body">45 Oakwood Terrace, Portland, OR</p>
              </div>
            </div>
            {/* Property Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-6">
                <img alt="Ultra-modern waterfront mansion" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWjilO6YH7kacUjtWkvstnlK9vYaPHKlKXXon3Q1Q4t67n7CowMwfqsLc7HMg2bpet7Wz5Vgyd2ZOrwwfeo_-35P_B1HVX0N0d36nVRzF0IB9nfdbFiRYvQnKXWMx92JM7y4gKSPm3J7rMiRHl_BzUNR4me7GKu1g9pPi-7Q2tnnmmhrjFQxBZuSK6ZHQ461q4JYsm6bzlcBwT1EMGmtsfN8ys5Kw0O-elPGigv2SqRLuYcMJK9VcX4pNGXrXKFtGle4zFqo60aVSC"/>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-on-surface uppercase tracking-widest font-body">Price Reduced</span>
                </div>
                <button className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-on-surface font-headline">$3,890,000</h3>
                <p className="font-medium text-on-surface-variant font-body">5 bds | 6 ba | 5,400 sqft</p>
                <p className="text-stone-500 text-sm font-body">122 Marine Way, Miami Beach, FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-8 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl"></div>
            <img alt="Professional real estate agent" className="relative z-10 rounded-xl shadow-xl w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQRHfY8Yb9h9QHalaZd2yqyvr4aPW0H32dshziSj_C3oWSgiNVpXaNq3kBjd9Oud0hy84a1ckFrXaAMKOFbt3Y8y3iJMLuJZP7jB3lDGiTDKu4ZObrJ0dHLop5i88JFcT6Onx1Ve6nfoBmy40oXgPaZsz9YLas5OYS-3K8flqG1YxBjHDxHzIm3iBcky4YaHOJZKBOUYDsF1OQQtZCW0X0qZlV8xeMEMNSJyXcIQ_QYlv__WQ8lBKf2FXSSB90d4mg-uQ8sntndoev"/>
          </div>
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight font-headline">Expertise that moves you forward.</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">home_work</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-headline">Buy with Confidence</h4>
                  <p className="text-on-surface-variant text-sm font-body">Our expert agents guide you through every step of the closing process with transparency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">sell</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-headline">Sell at Peak Value</h4>
                  <p className="text-on-surface-variant text-sm font-body">Leverage our high-end marketing suites and editorial photography to showcase your home.</p>
                </div>
              </div>
            </div>
            <button className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold hover:bg-surface-tint transition-all shadow-lg shadow-primary/20 font-body">Find an Agent</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
