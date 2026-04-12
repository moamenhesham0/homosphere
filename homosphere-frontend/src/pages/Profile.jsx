import { useEffect, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import {
  analyticsApi,
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getCurrentUserId,
  getFullName,
  getPropertyImageUrl,
  propertyListingApi,
  userApi,
  userSubscriptionApi,
} from '../services';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    phone: '',
    bio: '',
    location: '',
    photo: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const token = getAuthToken();
      const userId = getCurrentUserId();

      if (!token) {
        setErrorMessage('Sign in first to view your profile.');
        setIsLoading(false);
        return;
      }

      try {
        const [profilePayload, savedPayload, mySubscriptionsPayload, analyticsPayload] =
          await Promise.all([
            userApi.getCurrentUser(token),
            userId ? propertyListingApi.getSavedPropertyListings(userId, token) : [],
            userSubscriptionApi.getMySubscriptions(token),
            analyticsApi.getUserSubscriptionAnalytics(token),
          ]);

        if (!isMounted) {
          return;
        }

        setProfile(profilePayload);
        setSavedProperties(Array.isArray(savedPayload) ? savedPayload : []);
        setSubscriptions(Array.isArray(mySubscriptionsPayload) ? mySubscriptionsPayload : []);
        setSubscriptionAnalytics(analyticsPayload || null);
        setEditData({
          firstName: profilePayload?.firstName || '',
          lastName: profilePayload?.lastName || '',
          userName: profilePayload?.userName || '',
          phone: profilePayload?.phone || '',
          bio: profilePayload?.bio || '',
          location: profilePayload?.location || '',
          photo: profilePayload?.photo || '',
        });
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
  }, []);

  const handleSaveProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to update your profile.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const updated = await userApi.updateCurrentUser(editData, token);
      setProfile(updated);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = getFullName(profile?.firstName, profile?.lastName, profile?.userName || 'Profile');

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-24 flex-grow max-w-7xl mx-auto px-8 pb-16 w-full">
        {errorMessage && (
          <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="bg-surface-container-lowest rounded-xl p-8 transition-all shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary-container">
                    <img
                      className="w-full h-full object-cover"
                      alt="Profile"
                      src={profile?.photo || 'https://via.placeholder.com/200x200?text=User'}
                    />
                  </div>
                  <h2 className="font-headline font-extrabold text-xl text-on-surface">
                    {displayName}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-1">{profile?.email || 'No email on file'}</p>
                  <p className="text-on-surface-variant text-sm">{profile?.location || 'No location set'}</p>
                  <button
                    className="mt-6 w-full py-2 border border-outline-variant/15 text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-colors"
                    type="button"
                    onClick={() => setIsEditing((current) => !current)}
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="bg-surface-container-lowest rounded-xl p-5 space-y-3 shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                    placeholder="First Name"
                    value={editData.firstName}
                    onChange={(event) => setEditData((current) => ({ ...current, firstName: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                    placeholder="Last Name"
                    value={editData.lastName}
                    onChange={(event) => setEditData((current) => ({ ...current, lastName: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                    placeholder="Username"
                    value={editData.userName}
                    onChange={(event) => setEditData((current) => ({ ...current, userName: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                    placeholder="Phone"
                    value={editData.phone}
                    onChange={(event) => setEditData((current) => ({ ...current, phone: event.target.value }))}
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm"
                    placeholder="Location"
                    value={editData.location}
                    onChange={(event) => setEditData((current) => ({ ...current, location: event.target.value }))}
                  />
                  <textarea
                    className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-sm min-h-20"
                    placeholder="Bio"
                    value={editData.bio}
                    onChange={(event) => setEditData((current) => ({ ...current, bio: event.target.value }))}
                  />
                  <button
                    className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>
          </aside>

          <section className="flex-grow space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-headline font-black text-emerald-900 tracking-tight">Saved Homes</h1>
                <p className="text-on-surface-variant font-body">
                  {isLoading
                    ? 'Loading your saved properties...'
                    : `You have ${savedProperties.length} properties saved.`}
                </p>
              </div>
            </header>

            {savedProperties.length === 0 && !isLoading ? (
              <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
                No saved properties yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {savedProperties.map((property) => (
                  <PropertyCard
                    key={property.propertyListingId}
                    propertyId={property.propertyListingId}
                    image={getPropertyImageUrl(property)}
                    price={formatPrice(property.price)}
                    addressLine1={property.title || 'Untitled Listing'}
                    addressLine2={formatCompactAddress(property.city, property.state)}
                    beds={property.bedrooms || 0}
                    baths={property.bathrooms || 0}
                    sqft={property.propertyAreaSqFt ? Number(property.propertyAreaSqFt).toLocaleString('en-US') : 'N/A'}
                  />
                ))}
              </div>
            )}

            <div className="rounded-xl bg-surface-container-low p-8">
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">Subscription Overview</h3>
              <p className="text-on-surface-variant mb-2">
                Active subscriptions: <span className="font-semibold text-on-surface">{subscriptions.length}</span>
              </p>
              <p className="text-on-surface-variant">
                Current plan:{' '}
                <span className="font-semibold text-on-surface">
                  {subscriptionAnalytics?.tier || 'No active tier'}
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
