import { useCallback, useEffect, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import {
  formatCompactAddress,
  formatPrice,
  getCollectionPayload,
  getPropertyImageUrl,
  propertyApi,
} from '../services';

const PAGE_SIZE = 12;

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const [listings, setListings] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const applyResponse = useCallback((payload) => {
    const collection = getCollectionPayload(payload);
    setListings(collection);
    setTotalResults(payload?.totalElements ?? collection.length);
  }, []);

  const loadDefaultListings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = await propertyApi.filterProperties({
        page: 0,
        size: PAGE_SIZE,
      });
      applyResponse(payload);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load property listings.');
    } finally {
      setIsLoading(false);
    }
  }, [applyResponse]);

  useEffect(() => {
    loadDefaultListings();
  }, [loadDefaultListings]);

  const searchListings = useCallback(async () => {
    const query = searchInput.trim();
    if (!query) {
      loadDefaultListings();
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = await propertyApi.searchProperties(query, {
        page: 0,
        size: PAGE_SIZE,
      });
      applyResponse(payload);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to run search.');
    } finally {
      setIsLoading(false);
    }
  }, [applyResponse, loadDefaultListings, searchInput]);

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-20 h-screen flex flex-col">
        <header className="bg-surface-container-lowest border-b border-outline-variant/15 z-40">
          <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <div className="relative flex-shrink-0 min-w-[320px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 text-sm"
                placeholder="Address, City, or ZIP"
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchListings();
                  }
                }}
              />
            </div>
            <button
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-95 transition-opacity flex-shrink-0"
              type="button"
              onClick={searchListings}
            >
              Search
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Price <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Beds & Baths <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-medium text-sm hover:opacity-90 transition-opacity">
              Home Type <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <section className="w-full lg:w-3/5 overflow-y-auto bg-surface-container-low px-8 py-10 hide-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-baseline justify-between mb-8">
                <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
                  Property Search
                </h1>
                <span className="text-outline font-medium">
                  {isLoading ? 'Loading...' : `${totalResults} results`}
                </span>
              </div>

              {errorMessage && (
                <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
                  {errorMessage}
                </p>
              )}

              {!errorMessage && !isLoading && listings.length === 0 && (
                <p className="rounded-lg bg-surface-container-lowest px-4 py-6 text-on-surface-variant">
                  No listings match your current search.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listings.map((listing) => (
                  <PropertyCard
                    key={listing.propertyListingId}
                    propertyId={listing.propertyListingId}
                    image={getPropertyImageUrl(listing)}
                    price={formatPrice(listing.price)}
                    addressLine1={listing.title || 'Untitled Listing'}
                    addressLine2={formatCompactAddress(listing.city, listing.state)}
                    beds={listing.bedrooms || 0}
                    baths={listing.bathrooms || 0}
                    sqft={
                      listing.propertyAreaSqFt
                        ? Number(listing.propertyAreaSqFt).toLocaleString('en-US')
                        : 'N/A'
                    }
                    newConstruction={listing.condition === 'NEW'}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="hidden lg:block lg:w-2/5 relative bg-surface-container border-l border-outline-variant/15">
            <div className="absolute inset-0 bg-stone-200">
              <img className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply" alt="Map view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPp3Hm9JesSE8Vj3ro858arVJn8HCzVZMxShlKJfGTqj37SZI5yVrNzbn_tler5ubJvbDXY_A4l35RYp-reX-WpEeIFYW4-9BjdXtY_6SjEErGz9Hakxbak7DhUKsukrQzVcyH7SLSApHRdG13dlX9I8GtgufekQgRvzgIeVpTZhJjnK6Eu5UNOVxoCd8KntjKn-s3zYlT3d-e3VkG4SwE2IsjQzVdF3lxy8zJQcOPKKPyCUc9DWmPz6wWaCLSl1ZFqXDuBXVZCa6W" />
            </div>
          </aside>
        </div>
      </main>

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

