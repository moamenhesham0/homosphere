import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import FactFeatureCard from '../components/FactFeatureCard';
import {
  formatPrice,
  getAuthToken,
  getCurrentUser,
  getFullName,
  getPropertyImageUrl,
  propertyListingApi,
  viewingRequestApi,
} from '../services';

export default function PropertyDetails() {
  const { propertyId: pathPropertyId } = useParams();
  const location = useLocation();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tourMessage, setTourMessage] = useState('');

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
        const payload = await propertyListingApi.getPublicPropertyListingById(propertyId);
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

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-20 flex-grow">
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
                    src={galleryImages[0]}
                  />
                </div>

                {galleryImages.slice(1).map((imageUrl) => (
                  <div key={imageUrl} className="hidden md:block relative group overflow-hidden rounded-lg">
                    <img
                      alt="Property gallery"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={imageUrl}
                    />
                  </div>
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
                        {property.condition.replaceAll('_', ' ')}
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
                      value={property?.type || 'N/A'}
                    />
                    <FactFeatureCard
                      icon="event_available"
                      title="Year Built"
                      value={property?.yearBuilt || 'N/A'}
                    />
                    <FactFeatureCard
                      icon="directions_car"
                      title="Condition"
                      value={property?.condition ? property.condition.replaceAll('_', ' ') : 'N/A'}
                    />
                    <FactFeatureCard
                      icon="visibility"
                      title="Views"
                      value={listing?.views ?? 0}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-6">
                  <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] space-y-6">
                    <div className="space-y-4">
                      <button
                        className="w-full py-4 bg-primary text-on-primary rounded-lg font-black font-headline text-lg hover:bg-surface-tint transition-all shadow-sm"
                        type="button"
                        onClick={handleTakeTour}
                      >
                        Take a Tour
                      </button>
                      <button className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-lg font-black font-headline text-lg hover:bg-secondary-fixed-dim transition-all" type="button">
                        Contact Agent
                      </button>
                    </div>
                    <div className="pt-6 border-t border-outline-variant/15 text-sm text-on-surface-variant">
                      <p>Seller: {listing?.sellerName || 'Unknown Seller'}</p>
                      <p>Broker: {listing?.brokerName || 'Not assigned'}</p>
                      {tourMessage && <p className="mt-3">{tourMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
