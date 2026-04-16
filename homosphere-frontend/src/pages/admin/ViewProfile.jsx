import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import PropertyCard from '../../components/PropertyCard';
import { ROUTES } from '../../constants/routes';
import {
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getFullName,
  getPropertyImageUrl,
  propertyListingApi,
  userApi,
} from '../../services';

function normalizeRole(role) {
  if (typeof role !== 'string') {
    return '';
  }

  return role.trim().toUpperCase().replace(/^ROLE_/, '');
}

function resolveLocation(profile) {
  if (profile?.location) {
    return profile.location;
  }

  const compact = formatCompactAddress(profile?.city, profile?.state);
  if (compact !== 'Location unavailable') {
    return compact;
  }

  return profile?.country || 'Location not set';
}

export default function ViewProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userId } = useParams();
  const [profile, setProfile] = useState(state?.userSummary || null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const randomProfilePhoto = useMemo(
    () => `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const token = getAuthToken();

      if (!token) {
        setErrorMessage('Admin token is required to access this profile.');
        setIsLoading(false);
        return;
      }

      if (!userId) {
        setErrorMessage('User id is required to view this profile.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profilePayload, savedPayload, listedPayload] = await Promise.all([
          userApi.getPrivateUserById(userId, token),
          propertyListingApi.getSavedPropertyListings(userId, token),
          propertyListingApi.getUserPropertyListings(userId, token),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profilePayload || null);
        setSavedProperties(Array.isArray(savedPayload) ? savedPayload : []);
        setListedProperties(Array.isArray(listedPayload) ? listedPayload : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage(error.message || 'Failed to load profile data.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const displayName = getFullName(profile?.firstName, profile?.lastName, profile?.userName || 'Profile');
  const normalizedRole = normalizeRole(profile?.role);
  const isSeller = ['SELLER', 'BROKER'].includes(normalizedRole) || (
    listedProperties.length > 0 && savedProperties.length === 0
  );
  const homesPanelLabel = isSeller ? 'Listed Homes' : 'Saved Homes';
  const locationLabel = resolveLocation(profile);
  const properties = isSeller ? listedProperties : savedProperties;
  const propertiesTitle = isSeller ? 'Listed Homes' : 'Saved Homes';
  const loadingMessage = isSeller ? 'Loading listed properties...' : 'Loading saved properties...';
  const emptyMessage = isSeller ? 'No listed properties yet.' : 'No saved properties yet.';

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">

      <div className="flex flex flex-col min-h-screen bg-surface">
        <header className="h-16 flex items-center justify-between px-8 border-b border-outline-variant/15 bg-white/60 backdrop-blur-md">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/25 px-4 py-2 text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors"
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_USER_MANAGEMENT)}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Users
          </button>
        </header>

        <main className="p-8 flex-grow">
          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm transition-all">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary-container">
                      <img
                        className="w-full h-full object-cover"
                        alt="Profile"
                        src={profile?.photo || randomProfilePhoto}
                      />
                    </div>
                    <div className="w-full text-center">
                      <h2 className="font-manrope font-extrabold text-xl text-on-surface">{displayName}</h2>
                      <p className="text-on-surface-variant text-sm mt-1">{profile?.email || ''}</p>
                      <p className="text-on-surface-variant text-sm">{locationLabel}</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-2">
                  <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span>{homesPanelLabel}</span>
                  </div>
                </nav>
              </div>
            </aside>

            <section className="flex-grow space-y-12">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-headline font-black text-emerald-900 tracking-tight">{propertiesTitle}</h1>
                  <p className="text-on-surface-variant font-body">
                    {isLoading
                      ? loadingMessage
                      : `This user has ${properties.length} ${propertiesTitle.toLowerCase()}.`}
                  </p>
                </div>
              </header>

              {isLoading ? (
                <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
                  {loadingMessage}
                </div>
              ) : properties.length === 0 ? (
                <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
                  {emptyMessage}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.propertyListingId || property.id || `${property.title || 'property'}-${index}`}
                      propertyId={property.propertyListingId}
                      image={getPropertyImageUrl(property)}
                      price={formatPrice(property.price)}
                      addressLine1={property.title || 'Untitled Listing'}
                      addressLine2={formatCompactAddress(property.city, property.state)}
                      beds={property.bedrooms || 0}
                      baths={property.bathrooms || 0}
                      sqft={
                        property.propertyAreaSqFt
                          ? Number(property.propertyAreaSqFt).toLocaleString('en-US')
                          : 'N/A'
                      }
                      featured={index === 0}
                      newConstruction={property.condition === 'NEW'}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
