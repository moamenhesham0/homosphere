import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import FactFeatureCard from '../components/FactFeatureCard';

export default function PropertyDetails() {
  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-20 flex-grow">
        {/* Photo Gallery Section */}
        <section className="max-w-7xl mx-auto px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
              <img alt="Main property view" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBPOZ-BvuTnCK0-z3XlLpMFthglN1d9Y-HfeRsw8Zh41wQZbXZEG6mio_boCAe6ThS3-bLUzt9NMkoDawac4bew1FOGpIR5PL344TnLgIKBK3xd5T6r2C_dCA3dxx9J4YaE6ZhZvnn1rCx_KOeuT-hiagEwPNJmqnQdvEAbS6SXQ3Eiov16-Kvq7Y75h_ckpmTFVNP_q1TEjFC4CbY0WUdeojXBrAfmS8G3KE4lanWge6ToIT00bPKMjDrKJOkWVQwVkfGtBLzheeA" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-lg">
              <img alt="Living area" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCk4PRif-lWDwe_b5aHdPv9kHR_6Dk_q34QlAkAb4flGu2NW0YIq2T2iao4a--cif0Jdvq_LTkfqHftR1dH5j21C6Czrd4XQwOYhrJbPku-U0JHLxp9mu6V11PJX87veey9nMOhUr_aC8f-vzwSN5zF9MmtGjxTPoNQsS-bMcvWj7apJPuCh-K2P0Fyo5eHCiDZXKn-d7a8DXka6wIb2PfuKcygI15UeSeNvVJlpG1zQJpuNDH9A34XSioXuzUymz2zOpGH3XhigA3" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-lg">
              <img alt="Kitchen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvpjOYgvV8U_661L6boIr7mC3ZFV8GumxZBME9BvxQzU9OGak37pFCXIF-6Dyl-9AsAroA4AXZXe7m3gC8tRdAufzElt8NBn_7Ai_9XK86zdQHQB9ybRpY-sp1_pLtHQbVt5eHaVomgJVhYUYM0YY37xfRSMN0CB4Biv-28h8gJQ-dPAfrEqSi-QipoZYsmtCTidWJk4EozcVGPq20VFnfxFjWuzigMpskjeEVhIHd3LGRlMobc0in64sJV5aMwCDj7Dv1jVP8SuiF" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-lg">
              <img alt="Bedroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcyZHJaNGuvSCaZgK0s2l_XiZ1yBYYTdD2tvmRfiQC8oD6RIypIb-HqlMPAzRoZiYkIbGFDfzVsJS5mITLQwxCNEi__B4zCyM25DwoQUnnat1h811PUHtYwkpf8XlkdXfWjy8xhv7MmoK4ILhYkjjKwttnkbyhpuVT_0F_B7YCj3ALkazclUGmrhSHkGC_zY22NBG13Jly3rCiTYWTkeb-lIp2-yRp6fXpibihsD1AFFf76VUIqFx0EkNI81l08TRyK73L4suk73A6" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-lg">
              <img alt="Patio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFwox-fEndrzEjwpH0C4aXlRFyVtcLsSFoi7ifu5rqEMOU3D9xk0z3S4vl7bvDlrDu1ozpVBruyCh_XSdVX2wdH7IgTBQ09byHtKjC5l2ERJy3YFcxdB115TGR8xpIp_wWl9Ccp7ZWlZnEoMc7ZgYZemSQfcnydy7VvAzVwehUqrt0doGiaZQhHKCaFKn9Km6xH5ZI6xqAQ0WL26b3y9inj7lMt-GHMctXbc1zEWeXBSxKOVjV1h2J2l_eCAFv1OLUlJqG7vhLFUg5" />
              <button className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm text-on-surface rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-sm">grid_view</span>
                Show all photos
              </button>
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar Layout */}
        <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold tracking-wider uppercase">For Sale</span>
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold tracking-wider uppercase">New Construction</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface leading-tight">The Obsidian House</h1>
                  <p className="text-xl text-on-surface-variant font-medium mt-2">742 Evergreen Terrace, Palo Alto, CA 94303</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black font-headline text-primary">$4,850,000</p>
                  <p className="text-on-surface-variant text-sm mt-1">Est. Payment: $24,450/mo</p>
                </div>
              </div>
              <div className="flex items-center gap-8 py-6 border-y border-outline-variant/15">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-headline">5</span>
                  <span className="text-on-surface-variant text-sm">Beds</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-headline">4.5</span>
                  <span className="text-on-surface-variant text-sm">Baths</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-headline">4,200</span>
                  <span className="text-on-surface-variant text-sm">sqft</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-headline">0.35</span>
                  <span className="text-on-surface-variant text-sm">Acres</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-headline text-on-surface">About this Home</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-body">
                The Obsidian House is a triumph of modern residential architecture, seamlessly blending indoor and outdoor living. Designed by the award-winning firm Zenith Architects, this residence offers a curated living experience characterized by floor-to-ceiling glass walls, natural stone textures, and an uncompromising attention to detail.
              </p>
              <p className="text-lg leading-relaxed text-on-surface-variant font-body">
                The open-concept floor plan features a chef's kitchen with Gaggenau appliances, an expansive primary suite with private terrace, and a climate-controlled wine cellar. Outside, the meticulously landscaped grounds include a 40-foot infinity pool and a fully-equipped outdoor kitchen, perfect for hosting summer soirées under the stars.
              </p>
              <button className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2">
                Read more description <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              </button>
            </div>

            {/* Facts & Features Bento Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-headline text-on-surface">Facts & Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FactFeatureCard icon="home" title="Property Type" value="Single Family Residential" />
                <FactFeatureCard icon="ac_unit" title="Cooling & Heating" value="Central, Electric, Heat Pump" />
                <FactFeatureCard icon="directions_car" title="Parking" value="3 Spaces (Attached Garage)" />
                <FactFeatureCard icon="event_available" title="Year Built" value="Completed in 2023" />
              </div>
            </div>

            {/* Price History */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-headline text-on-surface">Price History</h2>
              <div className="bg-surface-container-lowest overflow-hidden rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high">
                      <th className="p-4 font-bold text-sm font-headline">Date</th>
                      <th className="p-4 font-bold text-sm font-headline">Event</th>
                      <th className="p-4 font-bold text-sm font-headline">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr>
                      <td className="p-4 text-sm">05/12/2024</td>
                      <td className="p-4 text-sm font-medium">Listed for sale</td>
                      <td className="p-4 text-sm font-bold">$4,850,000</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm">11/20/2023</td>
                      <td className="p-4 text-sm font-medium">Price changed</td>
                      <td className="p-4 text-sm font-bold">$4,920,000</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm">08/15/2023</td>
                      <td className="p-4 text-sm font-medium">Initial listing</td>
                      <td className="p-4 text-sm font-bold">$5,100,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Horizon Valuation Section (Zestimate Style) */}
            <div className="bg-primary-container/10 border border-primary/10 p-8 rounded-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black font-headline text-primary">Horizon Valuation™</h3>
                  <p className="text-sm text-on-surface-variant">Real-time local market analysis</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black font-headline">$4,812,400</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-sm">
                  <span className="material-symbols-outlined text-xs">trending_up</span> 1.2% this month
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-primary/10">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Valuation Range</p>
                  <p className="font-bold">$4.6M - $5.1M</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rental Estimate</p>
                  <p className="font-bold">$18,500/mo</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Forecast</p>
                  <p className="font-bold">+3.4% in 1yr</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Action Card */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] space-y-6">
                <div className="space-y-4">
                  <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-black font-headline text-lg hover:bg-surface-tint transition-all shadow-sm">
                    Take a Tour
                  </button>
                  <button className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-lg font-black font-headline text-lg hover:bg-secondary-fixed-dim transition-all">
                    Contact Agent
                  </button>
                </div>
                <div className="flex flex-col gap-4 pt-6 border-t border-outline-variant/15">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img alt="Agent" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASCZmnOD69QJc3a6ze3J_ty8gTVHMSqowqYxAtRvI8ZakdqquJulUSmtoaw1S2HLc5WdzhzQeMpV7gosjj_9bingFQnskhvPh6lpRONg2543VN-OWFWdYr4Xt897L3DuatvJz15FKgnF-T1RT9mDFgznr_hJ6uCJ8N51UgeWpiPf31ENxWqzKW7ALKzKxBAV370Uyvziu3BU71WPmdp5PVKNPdKf2g71thBEGVjayaaYVyalvX4Myo-z4g8JXReCtYrXtU7gH2HWYf" />
                    </div>
                    <div>
                      <p className="font-bold font-headline">Julian Sterling</p>
                      <p className="text-xs text-on-surface-variant">Top Producer • Horizon Elite</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-outline-variant/30 rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors">Call</button>
                    <button className="flex-1 py-2 border border-outline-variant/30 rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors">Email</button>
                  </div>
                </div>
                <p className="text-[10px] text-center text-on-surface-variant italic">Listing provided by Horizon Realty Group. DRE #01928374</p>
              </div>

              {/* Neighborhood Micro-Map Card */}
              <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
                <h4 className="font-black font-headline">Neighborhood</h4>
                <div className="aspect-video bg-surface-variant rounded-lg relative overflow-hidden">
                  <img alt="Map" className="w-full h-full object-cover opacity-50 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1WqkpkVKRiRqKXQXsUmnEyln9e3__-l9fV_xtUQL4xizcUPyGMrJNU10YwVNIwbnr0qKwHt31GbOB-TprSpT_zRIszemxIpHi2zvOAmwfyrX14yA6ADKZh2hKqQxcA5zVTRI-74Q9j12Lc8Nbu-7NKK_UwamSGGJ8rLCEunP-YTw3eNbJ5OiOFbSqn4BbzJftIvjrUun9t4iQo-LZGLPKyWBDTsqiUrXnsa-nlY-YylfATW81ywqEaNl0PqMuMVEKJkjHecSTyopQ" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Walk Score</span>
                    <span className="font-bold">84 / 100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Transit Score</span>
                    <span className="font-bold">52 / 100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Schools</span>
                    <span className="font-bold text-emerald-600">Top Rated (9/10)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
