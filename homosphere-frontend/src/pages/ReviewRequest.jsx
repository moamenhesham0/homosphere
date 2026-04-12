import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import ReviewRequestCard from '../components/admin/ReviewRequestCard';
import {
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getPropertyImageUrl,
  propertyApi,
  propertySubmissionReviewApi,
} from '../services';

export default function ReviewRequest() {
  const navigate = useNavigate();
  const [reviewItems, setReviewItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadReviewQueue = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Sign in as admin to access the review queue.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const [reviewsPayload, pendingPayload] = await Promise.all([
        propertySubmissionReviewApi.getAllPropertySubmissionReviews(token),
        propertyApi.getPendingProperties(token),
      ]);

      const flagged = (Array.isArray(reviewsPayload) ? reviewsPayload : []).map((review) => ({
        propertyId: review?.propertyListing?.propertyListingId,
        title: review?.propertyListing?.title || 'Untitled Listing',
        address: formatCompactAddress(
          review?.propertyListing?.property?.location?.city,
          review?.propertyListing?.property?.location?.state,
        ),
        price: formatPrice(review?.propertyListing?.price),
        image: getPropertyImageUrl(review?.propertyListing),
        agent: review?.propertyListing?.sellerName || 'Unknown Agent',
        submittedDate: review?.propertyListing?.lastSubmissionData || 'N/A',
        status: 'Flagged',
        flaggedReason: review?.message || 'Requires Changes',
      }));

      const pending = (Array.isArray(pendingPayload) ? pendingPayload : []).map((item) => ({
        propertyId: item?.propertyListingId,
        title: item?.title || 'Untitled Listing',
        address: formatCompactAddress(item?.city, item?.state),
        price: formatPrice(item?.price),
        image: getPropertyImageUrl(item),
        agent: 'Seller',
        submittedDate: 'Pending',
        status: 'Pending Review',
      }));

      setReviewItems([...flagged, ...pending]);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load review queue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviewQueue();
  }, [loadReviewQueue]);

  const handleApprove = async (propertyId) => {
    const token = getAuthToken();
    if (!token || !propertyId) {
      return;
    }

    try {
      await propertyApi.updatePropertyListingStatus(
        {
          propertyListingId: propertyId,
          status: 'PUBLISHED',
        },
        token,
      );
      await loadReviewQueue();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to approve listing.');
    }
  };

  const handleFlag = async (propertyId) => {
    const token = getAuthToken();
    if (!token || !propertyId) {
      return;
    }

    const reviewerMessage =
      window.prompt('Enter the review note for this listing:', 'Requires additional documents') ||
      '';

    if (!reviewerMessage.trim()) {
      return;
    }

    try {
      await propertySubmissionReviewApi.createPropertySubmissionReview(
        {
          propertyListingId: propertyId,
          message: reviewerMessage.trim(),
        },
        token,
      );
      await loadReviewQueue();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to flag listing.');
    }
  };

  const pendingCount = useMemo(
    () => reviewItems.filter((item) => item.status === 'Pending Review').length,
    [reviewItems],
  );

  return (
    <div className="text-on-surface antialiased bg-surface min-h-screen flex flex-col">
      <TopNavBar />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 bg-surface px-4 pb-10 pt-24 md:px-10 md:pt-28">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
                Review Queue
              </h3>
              <p className="text-on-surface-variant font-medium font-body">
                You have <span className="text-primary font-bold">{pendingCount} pending approvals</span>.
              </p>
            </div>
            <button
              className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm transition-all font-body text-sm"
              type="button"
              onClick={loadReviewQueue}
            >
              <span className="material-symbols-outlined text-lg">sync</span>
              Refresh Queue
            </button>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              {isLoading ? (
                <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                  Loading review queue...
                </p>
              ) : null}

              {!isLoading && reviewItems.length === 0 ? (
                <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                  No review items in queue.
                </p>
              ) : null}

              {reviewItems.map((item) => (
                <ReviewRequestCard
                  key={`${item.status}-${item.propertyId}`}
                  propertyId={item.propertyId}
                  image={item.image}
                  title={item.title}
                  address={item.address}
                  price={item.price}
                  agent={item.agent}
                  submittedDate={item.submittedDate}
                  status={item.status}
                  flaggedReason={item.flaggedReason}
                  onApprove={handleApprove}
                  onFlag={handleFlag}
                  onDetails={(id) => navigate(`/property-details/${id}`)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

