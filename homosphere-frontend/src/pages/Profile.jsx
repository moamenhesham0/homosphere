import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { useSupabaseUser } from '../context/supabaseContext';
import { ROUTES } from '../constants/routes';
import {
  analyticsApi,
  clearAuthSession,
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getCollectionPayload,
  getCurrentUser,
  getCurrentUserId,
  getFullName,
  getPropertyImageUrl,
  mediaApi,
  propertyListingApi,
  userApi,
  userSubscriptionApi,
} from '../services';
import PropertyCard from '../components/PropertyCard';
import ProfileCard from '../components/profile/ProfileCard';

function splitName(fullName) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: rest.join(' '),
  };
}

function normalizeRole(role) {
  if (typeof role !== 'string') {
    return '';
  }

  return role.trim().toUpperCase().replace(/^ROLE_/, '');
}

export default function Profile() {
  const navigate = useNavigate();
  const { signOut } = useSupabaseUser();
  const [profile, setProfile] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);
  const [listedPage, setListedPage] = useState(0);
  const [hasMoreListed, setHasMoreListed] = useState(true);
  const [isListedLoading, setIsListedLoading] = useState(false);
  const observer = useRef();
  
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
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activePanel, setActivePanel] = useState('saved-homes');
  const [fullNameDraft, setFullNameDraft] = useState('');

  const sessionUser = useMemo(() => getCurrentUser(), []);
  const normalizedProfileRole = normalizeRole(profile?.role);
  const normalizedSessionRole = normalizeRole(
    sessionUser?.role || sessionUser?.user_metadata?.role,
  );
  const effectiveRole = normalizedProfileRole || normalizedSessionRole;
  const hasSellerFlag = Boolean(
    sessionUser?.seller || sessionUser?.broker || sessionUser?.brocker,
  );
  const hasBuyerFlag = Boolean(sessionUser?.buyer);
  const isSeller = ['SELLER', 'BROKER'].includes(effectiveRole) || hasSellerFlag;
  const isBuyer = effectiveRole === 'BUYER' || hasBuyerFlag || (!isSeller && !effectiveRole);

  const syncEditStateFromProfile = (sourceProfile) => {
    setEditData({
      firstName: sourceProfile?.firstName || '',
      lastName: sourceProfile?.lastName || '',
      userName: sourceProfile?.userName || '',
      phone: sourceProfile?.phone || '',
      bio: sourceProfile?.bio || '',
      location: sourceProfile?.location || '',
      photo: sourceProfile?.photo || '',
    });

    setFullNameDraft(
      getFullName(sourceProfile?.firstName, sourceProfile?.lastName, sourceProfile?.userName || '').trim(),
    );
  };

  const fetchListedProperties = useCallback(async (page) => {
    const token = getAuthToken();
    if (!token) return;

    setIsListedLoading(true);
    try {
      const response = await propertyListingApi.getPropertyListingUserPage({
        token,
        page,
        size: 6,
      });
      const collection = getCollectionPayload(response);
      const hasMore = !response.last && collection.length > 0;

      setListedProperties((prev) => (page === 0 ? collection : [...prev, ...collection]));
      setHasMoreListed(hasMore);
    } catch (error) {
      console.error('Error fetching listed properties:', error);
      if (page === 0) {
        setErrorMessage(error.message || 'Failed to load listed properties.');
      }
    } finally {
      setIsListedLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSeller && profile) {
      fetchListedProperties(listedPage);
    }
  }, [listedPage, isSeller, profile, fetchListedProperties]);

  const lastListedElementRef = useCallback(
    (node) => {
      if (isListedLoading || !hasMoreListed) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreListed) {
          setListedPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isListedLoading, hasMoreListed],
  );

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
        syncEditStateFromProfile(profilePayload);
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

  const handleToggleEdit = () => {
    if (isEditing) {
      syncEditStateFromProfile(profile);
      setIsEditing(false);
      return;
    }

    syncEditStateFromProfile(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    syncEditStateFromProfile(profile);
    setIsEditing(false);
  };

  const handleUploadProfilePhoto = async (file) => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to update your profile photo.');
      return;
    }

    if (!file?.type?.startsWith('image/')) {
      setErrorMessage('Please select an image file.');
      return;
    }

    setIsPhotoUploading(true);
    setErrorMessage('');

    try {
      const uploaded = await mediaApi.uploadFile(file, token);
      if (!uploaded?.url) {
        throw new Error('Uploaded photo URL was not returned.');
      }

      setEditData((current) => ({
        ...current,
        photo: uploaded.url,
      }));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to upload profile photo.');
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to update your profile.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const parsedName = splitName(fullNameDraft);
      const normalizedUserName = (editData.userName || '').trim();
      const updatePayload = {
        ...editData,
        firstName: parsedName.firstName || editData.firstName,
        lastName: parsedName.firstName ? parsedName.lastName : editData.lastName,
        userName: normalizedUserName || null,
      };

      const updated = await userApi.updateCurrentUser(updatePayload, token);
      setProfile(updated);
      syncEditStateFromProfile(updated);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSavedProperty = async (propertyListingId) => {
    const token = getAuthToken();
    const userId = getCurrentUserId();

    if (!token || !userId) {
      setErrorMessage('Sign in first to update saved homes.');
      return;
    }

    try {
      await propertyListingApi.toggleSaveProperty(propertyListingId, userId, token);
      setSavedProperties((current) =>
        current.filter((property) => property.propertyListingId !== propertyListingId),
      );
    } catch (error) {
      setErrorMessage(error.message || 'Failed to remove saved property.');
    }
  };

  const handleRemoveListedProperty = async (propertyListingId) => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to update listed homes.');
      return;
    }

    try {
      await propertyListingApi.deletePropertyListing(propertyListingId, token);
      setListedProperties((current) =>
        current.filter((property) => property.propertyListingId !== propertyListingId),
      );
    } catch (error) {
      setErrorMessage(error.message || 'Failed to remove listed property.');
    }
  };

  const handleDeleteAccount = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in first to delete your account.');
      return;
    }

    const isConfirmed = window.confirm('Delete your account permanently? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    setIsDeletingAccount(true);
    setErrorMessage('');

    try {
      await userApi.deleteCurrentUser(token);
      clearAuthSession();
      navigate(ROUTES.SIGNIN);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error('Supabase sign-out failed:', error);
    } finally {
      clearAuthSession();
      setIsLoggingOut(false);
      navigate(ROUTES.SIGNIN);
    }
  };

  const handleResetPassword = () => {
    navigate(ROUTES.SIGNIN);
  };

  const displayName = getFullName(profile?.firstName, profile?.lastName, profile?.userName || 'Profile');
  const homesPanelLabel = isSeller ? 'Listed Homes' : 'Saved Homes';
  const isSubscriptionActive = (subscriptionAnalytics?.status || '').toUpperCase() === 'ACTIVE';
  const currentPlanLabel = subscriptionAnalytics?.tier || 'Basic';
  const paymentAmount = Number(subscriptionAnalytics?.paymentAmount || 0);
  const frequencyLabel = (subscriptionAnalytics?.paymentFrequency || 'Monthly').toLowerCase() === 'yearly'
    ? 'year'
    : 'month';
  const currentPlanPrice = paymentAmount > 0 ? `$${paymentAmount.toLocaleString('en-US')} / ${frequencyLabel}` : '$0 / month';
  const listedCount = Number(subscriptionAnalytics?.propertiesListed || 0);
  const listedLimit = Number(subscriptionAnalytics?.propertiesLimit || 0);
  const usagePercent = listedLimit > 0
    ? Math.min(100, Math.round((listedCount / listedLimit) * 100))
    : 25;

  const renderPropertiesPanel = ({
    title,
    properties,
    loadingMessage,
    emptyMessage,
    onFavoriteClick,
    lastElementRef,
    isPagingLoading,
  }) => {
    const isSavedHomesPanel = title === 'Saved Homes';

    return (
      <>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-black text-emerald-900 tracking-tight">{title}</h1>
            {isEditing && (
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">EDIT MODE</span>
            )}
          </div>
          <p className="text-on-surface-variant font-body">
            {isLoading
              ? loadingMessage
              : `You have ${properties.length} ${title.toLowerCase()}.`}
          </p>
        </div>
      </header>

      {isLoading || (properties.length === 0 && isPagingLoading) ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
          {loadingMessage}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((property, index) => {
              const isLast = index === properties.length - 1;
              return (
                <div 
                  key={property.propertyListingId || property.id || `${property.title || 'property'}-${index}`}
                  ref={isLast ? lastElementRef : null}
                >
                  <PropertyCard
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
                    isFavorited={isSavedHomesPanel}
                    onFavoriteClick={
                      isEditing && typeof onFavoriteClick === 'function'
                        ? () => onFavoriteClick(property.propertyListingId)
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
          {isPagingLoading && properties.length > 0 && (
            <div className="mt-8 text-center text-on-surface-variant font-bold animate-pulse">
              Loading more properties...
            </div>
          )}
        </>
      )}
      </>
    );
  };

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
          <ProfileCard
            profile={profile}
            displayName={displayName}
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            fullNameDraft={fullNameDraft}
            setFullNameDraft={setFullNameDraft}
            onToggleEdit={handleToggleEdit}
            onCancelEdit={handleCancelEdit}
            onSaveProfile={handleSaveProfile}
            isSaving={isSaving}
            isPhotoUploading={isPhotoUploading}
            onUploadPhoto={handleUploadProfilePhoto}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            homesPanelLabel={homesPanelLabel}
          />
          <section className="flex-grow space-y-12">
            {activePanel === 'saved-homes' ? (
              isBuyer ? (
                renderPropertiesPanel({
                  title: 'Saved Homes',
                  properties: savedProperties,
                  loadingMessage: 'Loading your saved properties...',
                  emptyMessage: 'No saved properties yet.',
                  onFavoriteClick: handleRemoveSavedProperty,
                })
              ) : isSeller ? (
                renderPropertiesPanel({
                  title: 'Listed Homes',
                  properties: listedProperties,
                  loadingMessage: 'Loading your listed properties...',
                  emptyMessage: 'No listed properties yet.',
                  onFavoriteClick: handleRemoveListedProperty,
                  lastElementRef: lastListedElementRef,
                  isPagingLoading: isListedLoading,
                })
              ) : (
                <div className="rounded-xl bg-surface-container-low p-8 space-y-2">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">
                    This section is available for buyer, seller, and broker accounts
                  </h3>
                  <p className="text-on-surface-variant">
                    Switch to one of those roles to use this panel.
                  </p>
                </div>
              )
            ) : (
              <>
                <header className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-headline font-black text-on-surface tracking-tight">
                    Account Settings
                  </h1>
                  <p className="text-on-surface-variant font-body text-base">
                    Manage your subscription and account options.
                  </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                  <section className="xl:col-span-2 bg-surface-container-lowest rounded-xl p-8">
                    <h3 className="text-lg font-bold font-headline mb-6">Security & Session</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <span className="material-symbols-outlined">logout</span>
                        {isLoggingOut ? 'Logging Out...' : 'Logout'}
                      </button>
                      <button
                        className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2"
                        type="button"
                        onClick={handleResetPassword}
                      >
                        <span className="material-symbols-outlined">lock_reset</span>
                        Reset Password
                      </button>
                    </div>
                    <div className="mt-10 pt-8 border-t border-outline-variant/15">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h4 className="text-error font-bold font-headline">Danger Zone</h4>
                          <p className="text-sm text-on-surface-variant mt-1">
                            Permanently delete your account and all associated real estate data. This action is irreversible.
                          </p>
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg bg-red-600 text-white border border-red-700 hover:bg-red-700 font-semibold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                        >
                          {isDeletingAccount ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </section>

                  <div className="space-y-8">
                    <section className="bg-primary-container/20 rounded-xl p-8 border border-primary-container/30 relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-lg font-bold font-headline text-on-primary-container">Subscription</h3>
                          <span
                            className={`px-3 py-1 text-[10px] font-bold rounded-full tracking-widest uppercase ${
                              isSubscriptionActive
                                ? 'bg-[#476738] text-white'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {isSubscriptionActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="space-y-6">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-sm text-on-primary-fixed-variant opacity-70">Current Plan</p>
                              <p className="text-2xl font-black font-headline text-on-primary-container">{currentPlanLabel}</p>
                            </div>
                            <p className="text-sm font-bold text-primary">{currentPlanPrice}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-surface-container-lowest/60 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-on-surface-variant">Active Subscriptions</span>
                              <span className="text-xs font-bold text-primary">{subscriptions.length}</span>
                            </div>
                            <div className="w-full h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${usagePercent}%` }} />
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-3 leading-relaxed italic">
                              View available subscriptions to unlock more listing tools and analytics.
                            </p>
                          </div>
                          <button
                            className="w-full py-3 rounded-xl bg-[#476738] text-white font-bold text-sm shadow-lg shadow-[#476738]/20 hover:scale-[1.02] transition-transform"
                            type="button"
                            onClick={() => navigate(ROUTES.SUBSCRIPTION)}
                          >
                            View Available Subscriptions
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
