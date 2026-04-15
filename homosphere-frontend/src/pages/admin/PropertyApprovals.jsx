import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ReviewRequestCard from '../../components/admin/ReviewRequestCard';
import {
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getPropertyImageUrl,
  propertyApi,
  propertySubmissionReviewApi,
} from '../../services';

export default function PropertyApprovals() {
  const navigate = useNavigate();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allPartitioned, setAllPartitioned] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagTargetPropertyId, setFlagTargetPropertyId] = useState('');
  const [flagMessage, setFlagMessage] = useState('Requires additional documents');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);

  const loadApprovals = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Admin token is required to view property approvals.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const [pendingPayload, partitionedPayload] = await Promise.all([
        propertyApi.getPendingProperties(token),
        propertyApi.getAllPropertiesPartitionedByStatus(token),
      ]);
      setPendingProperties(Array.isArray(pendingPayload) ? pendingPayload : []);
      setAllPartitioned(partitionedPayload?.propertiesByStatus || null);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load property approvals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const handleStatusUpdate = async (propertyListingId, status) => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Admin token is required to update listing status.');
      return;
    }

    try {
      await propertyApi.updatePropertyListingStatus(
        {
          propertyListingId,
          status,
        },
        token,
      );
      await loadApprovals();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update property status.');
    }
  };

  const stats = useMemo(() => {
    if (!allPartitioned) {
      return {
        pending: pendingProperties.length,
        flagged: 0,
        processed: 0,
      };
    }

    const published = allPartitioned.PUBLISHED?.length || 0;
    const rejected = allPartitioned.REJECTED?.length || 0;
    const requiresChanges = allPartitioned.REQUIRES_CHANGES?.length || 0;

    return {
      pending: allPartitioned.PENDING?.length || pendingProperties.length,
      flagged: requiresChanges,
      processed: published + rejected,
    };
  }, [allPartitioned, pendingProperties.length]);

  const handleFlag = (propertyId) => {
    if (!propertyId) {
      setErrorMessage('Invalid property listing id.');
      return;
    }
    setFlagTargetPropertyId(propertyId);
    setFlagMessage('Requires additional documents');
    setIsFlagModalOpen(true);
  };

  const closeFlagModal = () => {
    if (isSubmittingFlag) {
      return;
    }
    setIsFlagModalOpen(false);
    setFlagTargetPropertyId('');
    setFlagMessage('Requires additional documents');
  };

  const submitFlag = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Admin token is required to flag listings.');
      return;
    }
    if (!flagTargetPropertyId) {
      setErrorMessage('Invalid property listing id.');
      return;
    }
    if (!flagMessage.trim()) {
      setErrorMessage('Review note is required to flag a listing.');
      return;
    }

    try {
      setIsSubmittingFlag(true);
      await propertySubmissionReviewApi.createPropertySubmissionReview(
        {
          propertyListingId: flagTargetPropertyId,
          message: flagMessage.trim(),
        },
        token,
      );
      closeFlagModal();
      await loadApprovals();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to flag listing.');
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const pendingCards = useMemo(
    () =>
      pendingProperties.map((item) => ({
        propertyId: item?.propertyListingId || item?.propertyId,
        image: getPropertyImageUrl(item),
        title: item?.title || 'Untitled Listing',
        address: formatCompactAddress(item?.city, item?.state),
        price: formatPrice(item?.price),
        agent: item?.sellerName || 'Seller',
        submittedDate: item?.lastSubmissionData || 'Pending',
        status: item?.status === 'REQUIRES_CHANGES' ? 'Flagged' : 'Pending Review',
        flaggedReason: item?.flaggedReason || 'Requires Changes',
      })),
    [pendingProperties],
  );

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          searchQuery={headerSearchQuery}
          onSearchQueryChange={setHeaderSearchQuery}
          onSearch={loadApprovals}
        />

        <main className="flex-1 p-10 bg-surface">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">
                Property Approvals
              </h1>
              <p className="text-on-surface-variant font-body mt-2">
                Review and manage incoming property listings for Homosphere.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-h-11 items-center gap-4 rounded-xl bg-surface-container-lowest px-4 py-2 shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Pipeline Status
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary-container/20 px-3 py-1 text-primary">Pending {stats.pending}</span>
                  <span className="rounded-full bg-error-container px-3 py-1 text-error">Flagged {stats.flagged}</span>
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container">Processed {stats.processed}</span>
                </div>
              </div>
              <button
                className="px-6 py-2 rounded-full bg-primary text-on-primary font-label text-sm font-semibold shadow-[0px_12px_32px_rgba(26,27,31,0.06)] hover:opacity-90 transition-all"
                type="button"
                onClick={loadApprovals}
              >
                Refresh Queue
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                Loading pending approvals...
              </p>
            ) : null}

            {!isLoading && pendingCards.length === 0 ? (
              <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                No pending listings in the approval queue.
              </p>
            ) : null}

            {pendingCards.map((property) => (
              <ReviewRequestCard
                key={`${property.status}-${property.propertyId}`}
                propertyId={property.propertyId}
                image={property.image}
                title={property.title}
                address={property.address}
                price={property.price}
                agent={property.agent}
                submittedDate={property.submittedDate}
                status={property.status}
                flaggedReason={property.flaggedReason}
                onApprove={(id) => handleStatusUpdate(id, 'PUBLISHED')}
                onFlag={handleFlag}
                onDetails={(id) => navigate(`/property-details/${id}`)}
              />
            ))}
          </div>
        </main>
      </div>

      {isFlagModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-on-surface">Flag listing</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Add a short review note for the seller.
            </p>
            <textarea
              className="mt-4 min-h-28 w-full rounded-lg border border-outline-variant/50 bg-surface p-3 text-sm text-on-surface outline-none focus:border-error focus:ring-2 focus:ring-error/20"
              value={flagMessage}
              onChange={(event) => setFlagMessage(event.target.value)}
              placeholder="Enter review note..."
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                type="button"
                onClick={closeFlagModal}
                disabled={isSubmittingFlag}
              >
                Cancel
              </button>
              <button
                className="flex-3 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                type="button"
                onClick={submitFlag}
                disabled={isSubmittingFlag}
              >
                {isSubmittingFlag ? 'Submitting...' : 'Submit Flag'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
