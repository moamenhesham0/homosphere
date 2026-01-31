
import React, { useState, useMemo } from "react";
import DeletePropertyDialog from "./DeletePropertyDialog";
import { COLORS } from "../../constants/colors";

function PropertyCardsWithPagination({ properties, page, pageSize, total, onPageChange, onEdit, onDeleteClick, navigate }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <>
      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="empty-state">No properties found.</div>
        ) : (
          properties.map((l) => {
            const bannerUrl = l?.bannerImage?.imageUrl;
            const title = l?.title || "Untitled";
            const description = l?.description || "";
            const price = typeof l?.price === "number" ? l.price : parseFloat(l?.price || 0);
            const bedrooms = l?.property?.bedrooms || l?.bedrooms || 0;
            const bathrooms = l?.property?.bathrooms || l?.bathrooms || 0;
            const area = l?.property?.areaInSquareMeters || l?.propertyAreaInSquareFeet || 0;
            const type = l?.property?.propertyType || l?.propertyType || "";
            const city = l?.property?.location?.city || l?.city || "";
            const status = l?.status || "UNKNOWN";
            return (
              <div className="property-card" key={l?.propertyListingId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/property/${l.propertyListingId}`)}>
                {bannerUrl && (
                  <div className="property-image">
                    <img src={bannerUrl} alt={title} />
                    <span className={`status-badge status-${status.toLowerCase()}`}>
                      {status.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
                <div className="property-content">
                  <div className="property-price">${price.toLocaleString()}</div>
                  <h3 className="property-title">{title}</h3>
                  <p className="property-location">{city || "Location TBA"}</p>
                  <p className="property-type">{type}</p>
                  {description && (
                    <p className="property-description">{description.substring(0, 100)}...</p>
                  )}
                  <div className="property-features">
                    {bedrooms > 0 && (
                      <span className="feature">{bedrooms} beds</span>
                    )}
                    {bathrooms > 0 && (
                      <span className="feature">{bathrooms} baths</span>
                    )}
                    {area > 0 && (
                      <span className="feature">{area.toLocaleString()} sqft</span>
                    )}
                  </div>
                  <div className="property-actions">
                    {l.status === "REQUIRES_CHANGES" && (
                      <button className="action-btn edit-btn" onClick={e => { e.stopPropagation(); onEdit(l); }}>Edit</button>
                    )}
                    <button className="action-btn delete-btn" onClick={e => { e.stopPropagation(); onDeleteClick(l.propertyListingId); }}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>&lt;</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>&gt;</button>
      </div>
    </>
  );
}

export default function PropertyDashboard({
  propertyTabs,
  selectedTab,
  setSelectedTab,
  handleCreateListing,
  listingsLoading,
  listingsError,
  filteredListings,
  navigate,
  handleEditListing,
  handleDeleteListing
}) {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Dialog state for property deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Filter listings by selected tab (status, upper_snake_case)
  const filtered = useMemo(() => {
    if (selectedTab === "ALL") return filteredListings;
    return filteredListings.filter(l => l.status === selectedTab);
  }, [filteredListings, selectedTab]);

  // Paginated listings
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Reset to first page when tab changes
  React.useEffect(() => { setPage(1); }, [selectedTab]);


  // Handler to open dialog
  const handleDeleteClick = (propertyId) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
  };

  // Handler for edit (REQUIRES_CHANGES)
  const handleEditListingWithResubmit = async (listing) => {
    // Navigate to PropertyListingForm with id and resubmit mode
    navigate(`/property-listing-form?id=${listing.propertyListingId}&resubmit=true`);
  };

  // Handler after password-confirmed delete
  const handleConfirmDelete = async (propertyId) => {
    await handleDeleteListing(propertyId);
    setPropertyToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div
      className="section property-dashboard-themed"
      style={{
        background: '#fff',
        borderRadius: 22,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        border: `1.5px solid #e6e1d6`,
        padding: "2.5rem 2.5rem 2.5rem 2.5rem",
        marginBottom: "2.5rem",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3 style={{ color: COLORS.JUNGLE_GREEN, fontWeight: 800, fontSize: "2rem", marginBottom: "1.5rem" }}>Property Dashboard</h3>
      <div className="property-dashboard-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div className="property-tabs" style={{ display: "flex", gap: "0.7rem" }}>
          {propertyTabs.filter(tab => tab != null).map((tab) => (
            <button
              key={tab}
              className={`property-tab${selectedTab === tab ? " active" : ""}`}
              onClick={() => setSelectedTab(tab)}
              style={{
                background: selectedTab === tab ? COLORS.JUNGLE_GREEN : "#fff",
                color: selectedTab === tab ? "#fff" : COLORS.JUNGLE_GREEN,
                border: `2px solid ${COLORS.JUNGLE_GREEN}`,
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "1.08rem",
                padding: "0.7rem 1.7rem",
                boxShadow: selectedTab === tab ? "0 2px 8px rgba(0,166,118,0.10)" : "none",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                outline: "none",
              }}
            >
              {String(tab).replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <button
          className="create-listing-btn"
          onClick={handleCreateListing}
          style={{
            background: COLORS.JUNGLE_GREEN,
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "1.08rem",
            padding: "0.7rem 1.7rem",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,166,118,0.10)",
            cursor: "pointer",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          + Create Listing
        </button>
      </div>
      {listingsLoading && <div className="loading">Loading your listings...</div>}
      {listingsError && <div className="error-message">{listingsError}</div>}
      {!listingsLoading && !listingsError && (
        <PropertyCardsWithPagination
          properties={paginated}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onEdit={handleEditListingWithResubmit}
          onDeleteClick={handleDeleteClick}
          navigate={navigate}
        />
      )}
      <DeletePropertyDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        propertyId={propertyToDelete}
      />
    </div>
  );
}
