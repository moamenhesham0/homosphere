import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import axios from "axios";
import { COLORS } from "../../constants/colors";

export default function SavedProperties() {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setError("Please log in to view saved properties.");
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const token = session.access_token; 

      const response = await axios.get(
        `http://localhost:8080/api/property-listing/saved/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      setSavedProperties(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching saved properties:", err);
      
      if (err.response && err.response.status === 401) {
         setError("Session expired or unauthorized. Please log in again.");
      } else {
         setError("Failed to load saved properties.");
      }
      setLoading(false);
    }
  };

  const handleUnsave = async (e, propertyId) => {
    e.stopPropagation();

    const isConfirmed = window.confirm("Are you sure you want to remove this property from your saved list?");
    if (!isConfirmed) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const token = session.access_token; 

      await axios.post(
        `http://localhost:8080/api/property-listing/public/user/${propertyId}/save/${userId}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      setSavedProperties(prev => prev.filter(p => (p.propertyListingId || p.id) !== propertyId));
    } catch (err) {
      console.error("Error unsaving property:", err);
      alert("Failed to unsave property");
    }
  };
  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(savedProperties.length / pageSize));
  const paginatedProperties = savedProperties.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      className="section property-dashboard-themed"
      style={{
        background: '#fff',
        borderRadius: 22,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        border: `1.5px solid #e6e1d6`,
        padding: "2.5rem",
        marginBottom: "2.5rem",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3 style={{ color: COLORS.JUNGLE_GREEN, fontWeight: 800, fontSize: "2rem", marginBottom: "1.5rem" }}>
        Saved Properties
      </h3>

      {loading && <div className="loading">Loading saved properties...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="properties-grid">
            {paginatedProperties.length === 0 ? (
              <div className="empty-state">No saved properties found.</div>
            ) : (
              paginatedProperties.map((l) => {
                // Determine ID (handle inconsistencies in DTO naming if any)
                const id = l.propertyListingId || l.id;
                const bannerUrl = l?.bannerImage?.imageUrl || l?.image;
                const price = typeof l?.price === "number" ? l.price : parseFloat(l?.price || 0);
                
                return (
                  <div 
                    className="property-card" 
                    key={id} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => navigate(`/property/${id}`)}
                  >
                    {bannerUrl && (
                      <div className="property-image">
                        <img src={bannerUrl} alt={l.title} />
                        <span className={`status-badge status-${(l.status || 'PUBLISHED').toLowerCase()}`}>
                          {l.status?.replace(/_/g, " ") || 'PUBLISHED'}
                        </span>
                      </div>
                    )}
                    <div className="property-content">
                      <div className="property-price">${price.toLocaleString()}</div>
                      <h3 className="property-title">{l.title || "Untitled"}</h3>
                      <p className="property-location">
                        {l.city || l.property?.location?.city || "Location TBA"}
                      </p>
                      <div className="property-actions" style={{marginTop: '1rem'}}>
                        <button 
                          className="action-btn delete-btn" // Reusing delete style for 'Unsave'
                          onClick={(e) => handleUnsave(e, id)}
                          style={{width: '100%'}}
                        >
                          Unsave
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}