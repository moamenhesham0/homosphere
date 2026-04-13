import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import {
  formatCompactAddress,
  formatPrice,
  getPropertyImageUrl,
  propertyListingApi,
} from '../services';
import {getCurrentUser, getAuthToken} from "../services";
export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredError, setFeaturedError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    console.log(`user : ${JSON.stringify(user)}`);
    let isMounted = true;

    async function loadFeaturedListings() {
      try {
        const payload = await propertyListingApi.getPropertyListingStore();
        if (!isMounted) {
          return;
        }

        const listings = Array.isArray(payload) ? payload.slice(0, 3) : [];
        setFeaturedListings(listings);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFeaturedError(error.message || 'Failed to load featured listings.');
      }
    }

    loadFeaturedListings();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {featuredError && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {featuredError}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredListings.map((listing) => (
              <PropertyCard
                key={listing.propertyListingId}
                propertyId={listing.propertyListingId}
                image={getPropertyImageUrl(listing)}
                price={formatPrice(listing.price)}
                addressLine1={listing.title || 'Untitled Listing'}
                addressLine2={formatCompactAddress(listing.city, listing.state)}
                beds={listing.bedrooms || 0}
                baths={listing.bathrooms || 0}
                sqft={listing.propertyAreaSqFt ? Number(listing.propertyAreaSqFt).toLocaleString('en-US') : 'N/A'}
                newConstruction={listing.condition === 'NEW'}
              />
            ))}
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
