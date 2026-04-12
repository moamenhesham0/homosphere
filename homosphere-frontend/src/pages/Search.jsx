import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';

export default function Search() {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-20 h-screen flex flex-col">
        {/* Advanced Filtering Bar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant/15 z-40">
          <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center gap-4 overflow-x-auto hide-scrollbar">
            {/* Search Input Group */}
            <div className="relative flex-shrink-0 min-w-[320px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 text-sm" placeholder="Address, City, or ZIP" type="text" />
            </div>
            {/* Filters */}
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Price <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Beds & Baths <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Home Type <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-high text-on-surface font-medium text-sm hover:bg-surface-container-highest transition-colors">
              More <span className="material-symbols-outlined text-sm">tune</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <button className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-95 transition-opacity flex-shrink-0">
              Save Search
            </button>
          </div>
        </header>

        {/* Split Screen Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Listings Side */}
          <section className="w-full lg:w-3/5 overflow-y-auto bg-surface-container-low px-8 py-10 hide-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-baseline justify-between mb-8">
                {/* <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Luxury Homes in Austin, TX</h1> */}
                {/* <span className="text-outline font-medium">142 results</span> */}
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PropertyCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuBAt-ADjoXSJ7sT1xu4a95GdFcm0wfnV9O8MXiOF7U5aS9QUvkRFA5EVrmGmXJkyyzK7L5OxO7UR1D5P28c1V2eugTiSZChTxrD6sEUYiT0FBk9z3rMgz8Yhv9aIjuKJP-pVed0jCcZbufOwi5PhOpVeZOm9YbHSHUY5ltPeGOTEExhoQIhgeYSWpeFbK6Qp41_7wgiKuLPBqYI1-OAhHZDGak0mEaKaKO86cRzvdsdUQ2CoIryuc5QU8WSZ8BtCCrx7ubOXhHw5yLQ"
                  price="$2,450,000"
                  addressLine1="1248 Crestview Terrace"
                  addressLine2="Barton Hills • Austin, TX"
                  beds={4}
                  baths={3.5}
                  sqft="3,850"
                  featured={true}
                  trend="2%"
                />

                <PropertyCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuC1IpWGStDrgR5TfdwHNR9DQV5McMH0i8ombxL_BHdSkAdx7jm44UHfWOguUKJKzl5fSE_Atk1KeLz2fr-Ny5Ff-5D9sQfVR8NJok6d5vFjUZRcrCpLd7mr8og8BgTrJ-4aNGMgdOugg6haRr8QRox_6W4q3BI-sHo9vysi92EOfrrJTULQhEcEVPXX2gM8rmG84pckuR1wKtVk5t0UQ0stv5BzwbzSveVblY3IWuZXVOQslbYk4PHVhCDFJ5TG5oGx5qaNlfhAcKND"
                  price="$1,875,000"
                  addressLine1="8920 Rolling Oaks Cir"
                  addressLine2="Zilker • Austin, TX"
                  beds={3}
                  baths={3}
                  sqft="2,920"
                />

                <PropertyCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuAPlibxIAuOMJ3V0QyD-9YBGxaj9SLJy3JrGr5Hkkc4K1w3vVjS1TcgR3hfRexXkl5ItcwxwHIuJh90l-QMqBUepsnzcS6X_VfjtTW2BDAB9UnBMZiqIUtfyF36uoRGsHbNvDWaw4Oa72e6DuvWMYyBmF4fCMUdu76n5y5OiQKjUVcU5JjBOf5zjcnojlXBbtpLEf6rM0twTx69nQQ0K9VHZuXAfolPMEE1uyAobwH38KQP22hQ7DVtjV9kQE4YrvQYB2kFg_-9Ad9z"
                  price="$3,100,000"
                  addressLine1="2102 Silver Spur Rd"
                  addressLine2="Tarrytown • Austin, TX"
                  beds={5}
                  baths={5}
                  sqft="4,200"
                  newConstruction={true}
                />

                <PropertyCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuCaN-PUXdzddpXgUGodl75VdeZtay5vv5OvVXY4zcV0UuqAOak1ieVRyOP29ND0voBsDpl2g50trONpHPeLHHQGuKyhKZ-cvpKndTD5RBXw4lhFAXnJa-nSsq7wLU0imBq6aSZhZEJBDMw7zWX5tgVqkGzoz9veX4gzlOxNfmcr1F0Whn-BrW0dc4U9KAllBIyUsdYgRek6OKPPzELXXhf7yVs2h0wsvYQffyh0hoHA5nq8ihbLbhMw61o4T30raPoo44UX54QDT6lr"
                  price="$1,550,000"
                  addressLine1="4431 Wildwood Dr"
                  addressLine2="West Lake Hills • Austin, TX"
                  beds={3}
                  baths={2}
                  sqft="2,150"
                />
              </div> */}
            </div>
          </section>

          {/* Map Side */}
          <aside className="hidden lg:block lg:w-2/5 relative bg-surface-container border-l border-outline-variant/15">
            {/* Map Placeholder Representation */}
            <div className="absolute inset-0 bg-stone-200">
              <img className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply" alt="Map view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPp3Hm9JesSE8Vj3ro858arVJn8HCzVZMxShlKJfGTqj37SZI5yVrNzbn_tler5ubJvbDXY_A4l35RYp-reX-WpEeIFYW4-9BjdXtY_6SjEErGz9Hakxbak7DhUKsukrQzVcyH7SLSApHRdG13dlX9I8GtgufekQgRvzgIeVpTZhJjnK6Eu5UNOVxoCd8KntjKn-s3zYlT3d-e3VkG4SwE2IsjQzVdF3lxy8zJQcOPKKPyCUc9DWmPz6wWaCLSl1ZFqXDuBXVZCa6W" />
              {/* Mock Map Interaction Layer */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex gap-2">
                  <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-1.5 rounded-lg flex flex-col gap-1 shadow-xl">
                    <button className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-md transition-colors"><span className="material-symbols-outlined">add</span></button>
                    <div className="h-px w-full bg-stone-200"></div>
                    <button className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-md transition-colors"><span className="material-symbols-outlined">remove</span></button>
                  </div>
                </div>
                {/* Dynamic Marker Clusters */}
                <div className="absolute top-[20%] left-[30%] pointer-events-auto">
                  <div className="px-3 py-1.5 bg-primary text-on-primary font-bold rounded-full shadow-lg text-sm border-2 border-white ring-4 ring-primary/20">$2.4M</div>
                </div>
                <div className="absolute top-[45%] left-[60%] pointer-events-auto">
                  <div className="px-3 py-1.5 bg-emerald-900 text-on-primary font-bold rounded-full shadow-lg text-sm border-2 border-white">$1.8M</div>
                </div>
                <div className="absolute top-[35%] left-[45%] pointer-events-auto">
                  <div className="px-3 py-1.5 bg-white text-emerald-900 font-bold rounded-full shadow-lg text-sm border-2 border-primary">$3.1M</div>
                </div>
                <div className="absolute top-[70%] left-[25%] pointer-events-auto">
                  <div className="px-3 py-1.5 bg-emerald-900 text-on-primary font-bold rounded-full shadow-lg text-sm border-2 border-white">$1.5M</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Contextual FAB for search/map toggle on mobile (simulated) */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button className="flex items-center gap-3 px-8 py-4 bg-emerald-900 text-on-primary rounded-full shadow-2xl font-bold tracking-tight">
          <span className="material-symbols-outlined">map</span>
          Show Map
        </button>
      </div>

      <Footer />
    </div>
  );
}
