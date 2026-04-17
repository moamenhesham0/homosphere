import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from "../components/PropertyCardSkeleton";
import { toStateCode } from '../constants/usStates';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useURLState } from '../hooks/useURLState';
import {
  formatCompactAddress,
  formatPrice,
  getCollectionPayload,
  getCurrentUser,
  getCurrentUserId,
  getAuthToken,
  getPropertyImageUrl,
  propertyListingApi,
} from '../services';
import {
  AreaFilter,
  BedsBathsFilter,
  PriceFilter,
  PropertyTypeFilter,
  SearchBar,
  SortDirectionFilter,
  StateFilter,
} from '../components/search';
import PropertyMap from '../components/PropertyMap';

const INITIAL_FILTERS = {
  price: {
    min: '',
    max: '',
  },
  bedsBaths: {
    bedrooms: '',
    bathrooms: '',
  },
  area: {
    lotMin: '',
    lotMax: '',
    propertyMin: '',
    propertyMax: '',
  },
  sort: {
    field: 'price',
    direction: 'desc',
  },
  type: 'ANY',
  state: '',
};

function parseOptionalNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function toSortDirection(direction) {
  return direction === 'asc' ? 'ASC' : 'DESC';
}

function isSameFilters(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function buildSearchParams(searchInput, filters, page) {
  const selectedState = toStateCode(filters.state);
  return {
    searchQuery: searchInput.trim() || undefined,
    minPrice: parseOptionalNumber(filters.price.min),
    maxPrice: parseOptionalNumber(filters.price.max),
    minLotAreaSqFt: parseOptionalNumber(filters.area.lotMin),
    maxLotAreaSqFt: parseOptionalNumber(filters.area.lotMax),
    minPropertyAreaSqFt: parseOptionalNumber(filters.area.propertyMin),
    maxPropertyAreaSqFt: parseOptionalNumber(filters.area.propertyMax),
    bedrooms: parseOptionalInteger(filters.bedsBaths.bedrooms),
    bathrooms: parseOptionalInteger(filters.bedsBaths.bathrooms),
    type: filters.type === 'ANY' ? undefined : filters.type,
    state: selectedState || undefined,
    page,
    pageSize: 6,
    sortField: filters.sort.field,
    sortDirection: toSortDirection(filters.sort.direction),
  };
}

function buildFiltersFromURL(searchParams) {
  return {
    price: {
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || '',
    },
    bedsBaths: {
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
    },
    area: {
      lotMin: searchParams.get('minLotAreaSqFt') || '',
      lotMax: searchParams.get('maxLotAreaSqFt') || '',
      propertyMin: searchParams.get('minPropertyAreaSqFt') || '',
      propertyMax: searchParams.get('maxPropertyAreaSqFt') || '',
    },
    sort: {
      field: searchParams.get('sortField') || 'price',
      direction: (searchParams.get('sortDirection') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc',
    },
    type: searchParams.get('type') || 'ANY',
    state: searchParams.get('state') || '',
  };
}

function buildURLState(searchInput, filters, page) {
  const params = buildSearchParams(searchInput, filters, page);
  return {
    q: params.searchQuery,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    bedrooms: params.bedrooms,
    bathrooms: params.bathrooms,
    minLotAreaSqFt: params.minLotAreaSqFt,
    maxLotAreaSqFt: params.maxLotAreaSqFt,
    minPropertyAreaSqFt: params.minPropertyAreaSqFt,
    maxPropertyAreaSqFt: params.maxPropertyAreaSqFt,
    type: params.type,
    state: params.state,
    sortField: params.sortField === 'price' ? undefined : params.sortField,
    sortDirection: filters.sort.direction === 'desc' ? undefined : filters.sort.direction,
    page: page > 0 ? page : undefined,
  };
}

function isBuyerUser(user) {
  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toUpperCase() : '';
  return user?.buyer === true || normalizedRole === 'BUYER';
}



export default function Search() {
  const { searchParams, updateURLState } = useURLState();
  const [limits, setLimits] = useState({
    minPrice: null,
    maxPrice: null,
    minLotArea: null,
    maxLotArea: null,
    minPropertyArea: null,
    maxPropertyArea: null,
    maxBedrooms: null,
    maxBathrooms: null,
  });
  const [initialURLState] = useState(() => {
    const parsedPage = Number(searchParams.get('page'));
    const initialPage = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;

    return {
      searchInput: searchParams.get('q') || '',
      filters: buildFiltersFromURL(searchParams),
      page: initialPage,
    };
  });

  const [searchInput, setSearchInput] = useState(initialURLState.searchInput);
  const [filters, setFilters] = useState(initialURLState.filters || INITIAL_FILTERS);
  const [appliedSearchInput, setAppliedSearchInput] = useState(initialURLState.searchInput);
  const [appliedFilters, setAppliedFilters] = useState(initialURLState.filters || INITIAL_FILTERS);
  const [targetPage, setTargetPage] = useState(initialURLState.page);
  const [openFilter, setOpenFilter] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState(() => new Set());

  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  const requestDependencies = useMemo(
    () => [appliedSearchInput, JSON.stringify(appliedFilters)],
    [appliedSearchInput, appliedFilters],
  );

  const fetchPage = useCallback(
    async (page) => {
      setErrorMessage('');
      try {
        const payload = await propertyListingApi.searchPropertyListings(
          buildSearchParams(appliedSearchInput, appliedFilters, page),
        );
        const collection = getCollectionPayload(payload);
        const hasMore = Boolean(payload?.hasNext) || (Array.isArray(collection) && collection.length > 0 && !payload?.last);
        return {
          items: collection,
          hasMore,
        };
      } catch (error) {
        setErrorMessage(error.message || 'Failed to run search.');
        return {
          items: [],
          hasMore: false,
        };
      }
    },
    [appliedFilters, appliedSearchInput],
  );

  const {
    items: listings,
    page,
    isLoading,
    hasMore,
    loadNextPage,
    lastElementRef,
    // limits
  } = useInfiniteScroll(fetchPage, requestDependencies);

  useEffect(() => {
    let ignore = false;

    const loadSavedPropertyIds = async () => {
      const user = getCurrentUser();
      const token = getAuthToken();
      const userId = getCurrentUserId();

      if (!token || !userId || !isBuyerUser(user)) {
        setSavedPropertyIds(new Set());
        return;
      }

      try {
        const savedIds = await propertyListingApi.getSavedPropertyIds(userId, token);
        if (!ignore) {
          const normalized = Array.isArray(savedIds) ? savedIds.map((id) => String(id)) : [];
          setSavedPropertyIds(new Set(normalized));
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || 'Failed to load saved properties.');
        }
      }
    };

    loadSavedPropertyIds();

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleFavorite = useCallback(async (propertyListingId) => {
    const user = getCurrentUser();
    const token = getAuthToken();
    const userId = getCurrentUserId();

    if (!token || !userId || !isBuyerUser(user)) {
      setErrorMessage('Only buyer accounts can save properties.');
      return;
    }

    try {
      await propertyListingApi.toggleSaveProperty(propertyListingId, userId, token);
      setSavedPropertyIds((previous) => {
        const next = new Set(previous);
        const normalizedId = String(propertyListingId);
        if (next.has(normalizedId)) {
          next.delete(normalizedId);
        } else {
          next.add(normalizedId);
        }
        return next;
      });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save property.');
    }
  }, []);


  useEffect(() => {
    const loadLimits = async () => {
      const token = getAuthToken();
      try {
        const response = await propertyListingApi.getSearchLimits(token);
        // const data = await response.json();
        console.log(`new limits : ${JSON.stringify(response)}`);
        setLimits(response);
      } catch (error) {
        console.error(`Error Fetching Search Limits: ${error}`);
      }
    };

    loadLimits();
  }, []);

  useEffect(() => {
    if (page >= targetPage || !hasMore || isLoading) {
      return;
    }

    loadNextPage();
  }, [hasMore, isLoading, loadNextPage, page, targetPage]);

  useEffect(() => {
    const currentSearchInput = searchParams.get('q') || '';
    const currentFilters = buildFiltersFromURL(searchParams);

    if (currentSearchInput !== appliedSearchInput || !isSameFilters(currentFilters, appliedFilters)) {
      const parsedPage = Number(searchParams.get('page'));
      const currentPage = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;

      setSearchInput(currentSearchInput);
      setAppliedSearchInput(currentSearchInput);
      setFilters(currentFilters);
      setAppliedFilters(currentFilters);
      setTargetPage(currentPage);
      return; // Do not overwrite the URL we just navigated to
    }

    const nextState = buildURLState(appliedSearchInput, appliedFilters, page);
    updateURLState(nextState, { replace: true });
  }, [searchParams, appliedSearchInput, appliedFilters, page, updateURLState]);

  const searchListings = useCallback(() => {
    const trimmedInput = searchInput.trim();
    setAppliedSearchInput(trimmedInput);
    setAppliedFilters(filters);
    setTargetPage(0);
    setErrorMessage('');
    updateURLState(buildURLState(trimmedInput, filters, 0), { replace: false });
  }, [filters, searchInput, updateURLState]);

  const clearDraftFilters = useCallback(() => {
    setSearchInput('');
    setFilters(INITIAL_FILTERS);
    setOpenFilter(null);
  }, []);

  const hasPendingChanges =
    searchInput.trim() !== appliedSearchInput.trim() || !isSameFilters(filters, appliedFilters);
  const isDraftAtDefaults = searchInput.trim() === '' && isSameFilters(filters, INITIAL_FILTERS);

  const handleFilterOpenChange = useCallback((filterKey, isNextOpen) => {
    setOpenFilter(isNextOpen ? filterKey : null);
  }, []);

  const limitsLabel = useMemo(() => {
    if (limits.minPrice === null || limits.maxPrice === null) {
      return null;
    }

    return `${formatPrice(limits.minPrice)} - ${formatPrice(limits.maxPrice)} loaded`;
  }, [limits.maxPrice, limits.minPrice]);

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-20 h-screen flex flex-col">
        <header className="bg-stone-100 border-b border-outline-variant/15 z-40">
          <div className="max-w-full mr-auto px-8 py-4 flex items-center gap-4 overflow-x-auto overflow-y-visible hide-scrollbar">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              isLoading={isLoading}
              onSubmit={searchListings}
            />
            <StateFilter
                value={filters.state}
                onChange={(next) => setFilters((prev) => ({ ...prev, state: next }))}
                isOpen={openFilter === 'state'}
                onOpenChange={(isNextOpen) => handleFilterOpenChange('state', isNextOpen)}
            />
            <PropertyTypeFilter
                value={filters.type}
                onChange={(next) => setFilters((prev) => ({ ...prev, type: next }))}
                isOpen={openFilter === 'type'}
                onOpenChange={(isNextOpen) => handleFilterOpenChange('type', isNextOpen)}
            />
            <PriceFilter
                value={filters.price}
                onChange={(next) => setFilters((prev) => ({ ...prev, price: next }))}
                isOpen={openFilter === 'price'}
                onOpenChange={(isNextOpen) => handleFilterOpenChange('price', isNextOpen)}
                minBound={limits.minPrice}
                maxBound={limits.maxPrice}
            />
            <BedsBathsFilter
              value={filters.bedsBaths}
              onChange={(next) => setFilters((prev) => ({ ...prev, bedsBaths: next }))}
              isOpen={openFilter === 'bedsBaths'}
              onOpenChange={(isNextOpen) => handleFilterOpenChange('bedsBaths', isNextOpen)}
              maxBathroom={limits.maxBathrooms}
              maxBedroom={limits.maxBedrooms}
            />
            <AreaFilter
              value={filters.area}
              onChange={(next) => setFilters((prev) => ({ ...prev, area: next }))}
              isOpen={openFilter === 'area'}
              onOpenChange={(isNextOpen) => handleFilterOpenChange('area', isNextOpen)}
              maxPropertyArea={limits.maxPropertyArea}
              maxLotArea={limits.maxLotArea}
            />
            <SortDirectionFilter
              value={filters.sort}
              onChange={(next) => setFilters((prev) => ({ ...prev, sort: next }))}
              isOpen={openFilter === 'sort'}
              onOpenChange={(isNextOpen) => handleFilterOpenChange('sort', isNextOpen)}
            />
            <button
              type="button"
              onClick={clearDraftFilters}
              disabled={isDraftAtDefaults || isLoading}
              className="px-5 py-3 rounded-full border border-outline-variant/30 bg-surface text-on-surface font-semibold text-sm transition-opacity shrink-0 disabled:opacity-50"
            >
              Clear filters
            </button>

            <button
              type="button"
              onClick={searchListings}
              disabled={isLoading || !hasPendingChanges}
              className="ml-auto px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-95 transition-opacity shrink-0 disabled:opacity-60"
            >
              Search
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <section 
            className="w-full lg:w-1/2 overflow-y-auto bg-surface-container-low px-8 hide-scrollbar"
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-baseline justify-between mb-8">
                {/*<h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">*/}
                {/*  Property Search*/}
                {/*</h1>*/}
                {/*<span className="text-outline font-medium">*/}
                {/*  {isLoading && listings.length === 0 ? 'Loading...' : `${listings.length} results`}*/}
                {/*</span>*/}
              </div>

              {/*{limitsLabel && (*/}
              {/*  <p className="mb-6 text-sm text-on-surface-variant">Loaded price range: {limitsLabel}</p>*/}
              {/*)}*/}

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
                {listings.map((listing, index) => {
                  const isLastCard = index === listings.length - 1;

                  return (
                    <div
                      key={listing.propertyListingId || `${listing.title || 'listing'}-${index}`}
                      ref={isLastCard ? lastElementRef : null}
                      onMouseEnter={() => setHoveredPropertyId(listing.propertyListingId)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      className="transition-transform duration-200"
                    >
                      <PropertyCard
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
                        isFavorited={savedPropertyIds.has(String(listing.propertyListingId))}
                        onFavoriteClick={() => handleToggleFavorite(listing.propertyListingId)}
                      />
                    </div>
                  );
                })}
                {isLoading && Array.from({ length: 4 }).map((_, i) => (
                  <PropertyCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>

              {/*{isLoading && listings.length > 0 && (*/}
              {/*  // <p className="mt-8 text-center text-sm text-outline"></p>*/}
              {/*)}*/}
            </div>
          </section>

          <aside className="hidden lg:block lg:w-1/2 relative bg-surface-container border-l border-outline-variant/15">
            <div className="absolute inset-0 bg-stone-200">
              <PropertyMap
                hoveredPropertyId={isScrolling ? null : hoveredPropertyId}
                properties={listings.map(l => ({
                   id: l.propertyListingId,
                   type: l.type,
                   lat: l.latitude || l.lat || (39.8283 + (Math.random() - 0.5) * 10), // Safe fallback random to distribute unknown locations mostly across US
                   lng: l.longitude || l.lng || (-98.5795 + (Math.random() - 0.5) * 10),
                   price: l.price
                }))

              }
              />
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

      {/*<Footer />*/}
    </div>
  );
}

