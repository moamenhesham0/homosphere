import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import FactFeatureCard from '../components/FactFeatureCard';
import { Map, Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ROUTES } from '../constants/routes';
import {
  formatPrice,
  getAuthToken,
  getCurrentUser,
  getFullName,
  getPropertyImageUrl,
  isAdmin as isAdminSessionUser,
  propertyApi,
  viewingRequestApi,
} from '../services';
import {toNormalString} from "@/src/utils/enumConverter.js";

const DEFAULT_AI_BASE_URL = 'http://localhost:8000';
const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
const AI_BASE_URL = (viteEnv?.VITE_HOMOSPHERE_AI_BASE_URL || DEFAULT_AI_BASE_URL).replace(/\/+$/, '');

function formatCompactCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'N/A';
  }

  const amount = Number(value);
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }

  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }

  return `$${amount.toFixed(0)}`;
}

export default function PropertyDetails() {
  const navigate = useNavigate();
  const { propertyId: pathPropertyId } = useParams();
  const location = useLocation();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tourMessage, setTourMessage] = useState('');
  const [valuation, setValuation] = useState(null);
  const [isValuationLoading, setIsValuationLoading] = useState(false);
  const [valuationError, setValuationError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const propertyId = useMemo(() => {
    const queryId = new URLSearchParams(location.search).get('id');
    return pathPropertyId || queryId || location.state?.propertyId || '';
  }, [location.search, location.state, pathPropertyId]);

  useEffect(() => {
    let isMounted = true;

    async function loadPropertyDetails() {
      if (!propertyId) {
        setErrorMessage('No property ID was provided.');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const payload = await propertyApi.getPropertyById(propertyId);
        if (!isMounted) {
          return;
        }

        setListing(payload);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error.message || 'Failed to load property details.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPropertyDetails();

    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!listing) {
      setValuation(null);
      setValuationError('');
      setIsValuationLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    async function loadValuation() {
      const propertyData = listing?.property || {};
      const locationInfo = propertyData?.location || {};
      const city = locationInfo?.city;
      const state = locationInfo?.state;
      const zipCode = locationInfo?.zipCode;
      const houseSize = Number(propertyData?.propertyAreaSqFt);
      const lotSize = Number(propertyData?.lotAreaSqFt);
      const bed = Number(propertyData?.bedrooms);
      const bath = Number(propertyData?.bathrooms);

      if (!city || !state || !zipCode || !Number.isFinite(houseSize) || houseSize <= 0) {
        setValuation(null);
        setValuationError('AI valuation is unavailable for this listing.');
        return;
      }

      const payload = {
        bed: Number.isFinite(bed) && bed > 0 ? bed : 1,
        bath: Number.isFinite(bath) && bath > 0 ? bath : 1,
        city: String(city),
        state: String(state),
        zip_code: String(zipCode),
        house_size: houseSize,
        lot_size_sqft: Number.isFinite(lotSize) && lotSize > 0 ? lotSize : houseSize,
      };

      setIsValuationLoading(true);
      setValuationError('');

      try {
        const response = await fetch(`${AI_BASE_URL}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `AI valuation failed with status ${response.status}`);
        }

        const prediction = await response.json();
        const estimatedPrice = Number(prediction?.final_estimated_price);
        const trendFactor = Number(prediction?.market_trend_factor);

        if (!Number.isFinite(estimatedPrice) || estimatedPrice <= 0) {
          throw new Error('AI valuation returned an invalid estimate.');
        }

        if (!isMounted) {
          return;
        }

        setValuation({
          estimatedPrice,
          trendFactor: Number.isFinite(trendFactor) && trendFactor > 0 ? trendFactor : 1,
        });
      } catch (error) {
        if (!isMounted || error.name === 'AbortError') {
          return;
        }

        setValuation(null);
        setValuationError(error.message || 'Failed to load AI valuation.');
      } finally {
        if (isMounted) {
          setIsValuationLoading(false);
        }
      }
    }

    loadValuation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [listing]);

  const galleryImages = useMemo(() => {
    if (!listing) {
      return [];
    }

    const urls = [];
    const banner = listing?.bannerImage?.imageUrl;
    if (banner) {
      urls.push(banner);
    }

    (listing.propertyImages || []).forEach((image) => {
      if (image?.imageUrl && !urls.includes(image.imageUrl)) {
        urls.push(image.imageUrl);
      }
    });

    if (urls.length === 0) {
      urls.push(getPropertyImageUrl(listing));
    }

    return urls.slice(0, 5);
  }, [listing]);

  useEffect(() => {
    setMainImageIndex(0);
  }, [galleryImages]);

  const safeMainImageIndex =
    mainImageIndex >= 0 && mainImageIndex < galleryImages.length ? mainImageIndex : 0;
  const mainImageUrl = galleryImages[safeMainImageIndex];
  const thumbnailImages = galleryImages
    .map((imageUrl, index) => ({ imageUrl, index }))
    .filter(({ index }) => index !== safeMainImageIndex)
    .slice(0, 4);

  const property = listing?.property || {};
  const locationData = property?.location || {};
  const title = listing?.title || 'Property Listing';
  const address = [
    locationData.street,
    locationData.city,
    locationData.state,
    locationData.zipCode,
  ]
    .filter(Boolean)
    .join(', ');

  const fallbackPrice = Number(listing?.price);
  const hasAiValuation = Number.isFinite(valuation?.estimatedPrice) && valuation.estimatedPrice > 0;
  const effectivePrice = hasAiValuation
    ? valuation.estimatedPrice
    : Number.isFinite(fallbackPrice) && fallbackPrice > 0
      ? fallbackPrice
      : null;
  const valuationRangeMin = effectivePrice ? effectivePrice * 0.95 : null;
  const valuationRangeMax = effectivePrice ? effectivePrice * 1.05 : null;
  const rentalEstimate = effectivePrice ? effectivePrice * 0.0038 : null;
  const annualForecastPercent = ((valuation?.trendFactor || 1) - 1) * 100;
  const monthlyTrendPercent = annualForecastPercent / 12;
  const trendDirectionIcon = monthlyTrendPercent >= 0 ? 'trending_up' : 'trending_down';
  const trendClassName = monthlyTrendPercent >= 0 ? 'text-emerald-600' : 'text-error';
  const trendLabel = `${monthlyTrendPercent >= 0 ? '+' : ''}${monthlyTrendPercent.toFixed(1)}% this month`;
  const forecastLabel = `${annualForecastPercent >= 0 ? '+' : ''}${annualForecastPercent.toFixed(1)}% in 1yr`;
  const isAdminUser = isAdminSessionUser();

  const handleTakeTour = async () => {
    setTourMessage('');

    const token = getAuthToken();
    const currentUser = getCurrentUser();

    if (!token || !currentUser?.id) {
      setTourMessage('Sign in first to request a viewing.');
      return;
    }

    if (!property?.propertyId) {
      setTourMessage('This listing is missing a property identifier.');
      return;
    }

    const preferredDate =
      window.prompt('Preferred viewing date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10)) ||
      '';
    if (!preferredDate.trim()) {
      return;
    }

    const startTime = window.prompt('Preferred start time (HH:MM):', '10:00') || '';
    if (!startTime.trim()) {
      return;
    }

    const endTime = window.prompt('Preferred end time (HH:MM):', '11:00') || '';
    if (!endTime.trim()) {
      return;
    }

    const fallbackName = getFullName(
      currentUser.firstName,
      currentUser.lastName,
      currentUser.userName || 'Buyer',
    );
    const name = currentUser.userName || fallbackName;
    const email = currentUser.email || window.prompt('Email:', '') || '';
    const phone = currentUser.phone || window.prompt('Phone:', '') || '';
    const message = window.prompt('Message for the seller/agent:', 'Interested in viewing this property.') || '';

    if (!email.trim() || !phone.trim()) {
      setTourMessage('Email and phone are required to submit a viewing request.');
      return;
    }

    try {
      await viewingRequestApi.createViewingRequest(
        {
          propertyId: property.propertyId,
          propertyTitle: title,
          name,
          email,
          phone,
          preferredDate: preferredDate.trim(),
          startTime: `${startTime.trim()}:00`,
          endTime: `${endTime.trim()}:00`,
          message: message.trim(),
        },
        token,
      );
      setTourMessage('Viewing request submitted successfully.');
    } catch (error) {
      setTourMessage(error.message || 'Failed to submit viewing request.');
    }
  };

  const SAFE_MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      {!isAdminUser && <TopNavBar />}

      <main className={`${isAdminUser ? 'pt-8' : 'pt-20'} flex-grow`}>
        {isAdminUser && (
          <section className="w-full px-8">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/25 bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-container transition-colors"
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                  return;
                }
                navigate(ROUTES.ADMIN_USER_MANAGEMENT);
              }}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Return to previous page
            </button>
          </section>
        )}

        {errorMessage && (
          <section className="max-w-7xl mx-auto px-8 pt-8">
            <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          </section>
        )}

        {!errorMessage && (
          <>
            <section className="max-w-7xl mx-auto px-8 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
                  <img
                    alt="Main property view"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={mainImageUrl}
                  />
                </div>

                {thumbnailImages.map(({ imageUrl, index }) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    className="hidden md:block relative group overflow-hidden rounded-lg"
                    type="button"
                    onClick={() => setMainImageIndex(index)}
                  >
                    <img
                      alt="Property gallery"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={imageUrl}
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold tracking-wider uppercase">
                      {listing?.status || 'Unknown'}
                    </span>
                    {property?.condition && (
                      <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold tracking-wider uppercase">
                        {toNormalString(property.condition)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface leading-tight">
                        {title}
                      </h1>
                      <p className="text-xl text-on-surface-variant font-medium mt-2">
                        {address || 'Address unavailable'}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-4xl font-black font-headline text-primary">
                        {formatPrice(listing?.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 py-6 border-y border-outline-variant/15">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold font-headline">{property?.bedrooms ?? 'N/A'}</span>
                      <span className="text-on-surface-variant text-sm">Beds</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold font-headline">{property?.bathrooms ?? 'N/A'}</span>
                      <span className="text-on-surface-variant text-sm">Baths</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold font-headline">
                        {property?.propertyAreaSqFt
                          ? Number(property.propertyAreaSqFt).toLocaleString('en-US')
                          : 'N/A'}
                      </span>
                      <span className="text-on-surface-variant text-sm">sqft</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold font-headline">
                        {property?.lotAreaSqFt
                          ? Number(property.lotAreaSqFt).toLocaleString('en-US')
                          : 'N/A'}
                      </span>
                      <span className="text-on-surface-variant text-sm">Lot sqft</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black font-headline text-on-surface">About this Home</h2>
                  {isLoading ? (
                    <p className="text-on-surface-variant">Loading property details...</p>
                  ) : (
                    <p className="text-lg leading-relaxed text-on-surface-variant font-body">
                      {listing?.description || 'No description has been provided for this listing yet.'}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black font-headline text-on-surface">Facts & Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FactFeatureCard
                      icon="home"
                      title="Property Type"
                      value={property?.type ? toNormalString(property.type) : 'N/A'}
                    />
                    <FactFeatureCard
                      icon="event_available"
                      title="Year Built"
                      value={property?.yearBuilt || 'N/A'}
                    />
                    <FactFeatureCard
                      icon="directions_car"
                      title="Condition"
                      value={property?.condition ? toNormalString(property.condition) : 'N/A'}
                    />
                    <FactFeatureCard
                      icon="visibility"
                      title="Views"
                      value={listing?.views ?? 0}
                    />
                  </div>
                </div>

                <div className="bg-primary-container/10 border border-primary/10 p-8 rounded-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black font-headline text-primary">HomosphereAI&trade;</h3>
                      <p className="text-sm text-on-surface-variant">Real-time local market analysis</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black font-headline">
                      {isValuationLoading ? 'Calculating...' : effectivePrice ? formatPrice(effectivePrice) : 'N/A'}
                    </span>
                    <span className={`${trendClassName} font-bold flex items-center gap-1 text-sm`}>
                      <span className="material-symbols-outlined text-xs">{trendDirectionIcon}</span> {trendLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-primary/10">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Valuation Range</p>
                      <p className="font-bold">
                        {isValuationLoading
                          ? 'Calculating...'
                          : `${formatCompactCurrency(valuationRangeMin)} - ${formatCompactCurrency(valuationRangeMax)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rental Estimate</p>
                      <p className="font-bold">
                        {isValuationLoading ? 'Calculating...' : rentalEstimate ? `${formatPrice(rentalEstimate)}/mo` : 'N/A'}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Forecast</p>
                      <p className="font-bold">{forecastLabel}</p>
                    </div>
                  </div>
                  {valuationError && (
                    <p className="text-xs text-error">{valuationError}</p>
                  )}
                </div>
              </div>

              {!isAdminUser && (
                <div className="lg:col-span-1">
                  <div className="sticky top-28 space-y-6">
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] space-y-6">
                      <button
                        className="w-full py-4 bg-primary text-on-primary rounded-lg font-black font-headline text-lg hover:bg-surface-tint transition-all shadow-sm"
                        type="button"
                        onClick={handleTakeTour}
                      >
                        Take a Tour
                      </button>
                      <button className="w-full py-4 bg-secondary-container bg-[#dae5dd] text-on-secondary-container rounded-lg font-black font-headline text-lg hover:bg-secondary-fixed-dim transition-all" type="button">
                        Contact Agent
                      </button>

                      {locationData.latitude && locationData.longitude && (
                        <div className="h-64 w-full rounded-lg overflow-hidden border border-outline-variant/15 mt-6">
                          <Map
                            mapLib={maplibregl}
                            initialViewState={{
                              longitude: locationData.longitude,
                              latitude: locationData.latitude,
                              zoom: 14,
                            }}
                            style={{ width: '100%', height: '100%' }}
                            mapStyle={SAFE_MAP_STYLE}
                            interactive={false}
                          >
                            <Marker longitude={locationData.longitude} latitude={locationData.latitude} anchor="bottom">
                              <span className="material-symbols-outlined text-primary text-3xl location-pin">location_on</span>
                            </Marker>
                          </Map>
                        </div>
                      )}

                      <div className="pt-6 border-t border-outline-variant/15 text-sm text-on-surface-variant">
                        <p>Seller: {listing?.sellerName || 'Unknown Seller'}</p>
                        <p>Broker: {listing?.brokerName || 'Not assigned'}</p>
                        {tourMessage && <p className="mt-3">{tourMessage}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
