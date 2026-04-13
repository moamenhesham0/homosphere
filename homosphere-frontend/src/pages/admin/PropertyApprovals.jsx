import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ApprovalCard from '../../components/admin/ApprovalCard';
import {
  formatCompactAddress,
  formatPrice,
  getAuthToken,
  getPropertyImageUrl,
  propertyApi,
} from '../../services';

export default function PropertyApprovals() {
  const navigate = useNavigate();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allPartitioned, setAllPartitioned] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 p-10 bg-surface">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">
                Property Approvals
              </h1>
              <p className="text-on-surface-variant font-body mt-2">
                Review and manage incoming property listings for Homosphere.
              </p>
            </div>
            <button
              className="px-6 py-2 rounded-full bg-primary text-on-primary font-label text-sm font-semibold shadow-[0px_12px_32px_rgba(26,27,31,0.06)] hover:opacity-90 transition-all"
              type="button"
              onClick={loadApprovals}
            >
              Refresh Queue
            </button>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pipeline Status</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Pending</span>
                    <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-bold rounded-full">
                      {stats.pending}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Flagged</span>
                    <span className="px-3 py-1 bg-error-container text-error text-xs font-bold rounded-full">
                      {stats.flagged}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Processed</span>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">
                      {stats.processed}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9 space-y-4">
              {isLoading ? (
                <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                  Loading pending approvals...
                </p>
              ) : null}

              {!isLoading && pendingProperties.length === 0 ? (
                <p className="rounded-xl bg-surface-container-lowest p-6 text-on-surface-variant">
                  No pending listings in the approval queue.
                </p>
              ) : null}

              {pendingProperties.map((property) => (
                <ApprovalCard
                  key={property.propertyListingId}
                  propertyId={property.propertyListingId}
                  image={getPropertyImageUrl(property)}
                  title={property.title || 'Untitled Listing'}
                  address={formatCompactAddress(property.city, property.state)}
                  price={formatPrice(property.price)}
                  status={property.status || 'Pending Review'}
                  submittedTime="Pending"
                  photosCount={1}
                  onApprove={(id) => handleStatusUpdate(id, 'PUBLISHED')}
                  onReject={(id) => handleStatusUpdate(id, 'REJECTED')}
                  onView={(id) => navigate(`/property-details/${id}`)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

