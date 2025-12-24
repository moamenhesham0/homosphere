import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { updatePropertyStatus } from '../services/apiPropertyStatus';
import { fetchPropertyReviews } from '../services/apiPropertyReviews';
import { fetchSinglePropertyReviews } from '../services/apiSinglePropertyReviews';
import { FaRegCommentDots } from 'react-icons/fa';
import '../styles/AdminPortal.css';
import UsersListing from './UsersListing';

export default function AdminPortal() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('admins');
  const [propertyTab, setPropertyTab] = useState('ALL');
  const [propertyValidationList, setPropertyValidationList] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewPropertyId, setReviewPropertyId] = useState(null);
  const [propertyReviews, setPropertyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showPropertyReviewsModal, setShowPropertyReviewsModal] = useState(false);
  const [propertyReviewsList, setPropertyReviewsList] = useState([]);
  const [propertyReviewsLoading, setPropertyReviewsLoading] = useState(false);
  const [propertyReviewsTitle, setPropertyReviewsTitle] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/signin');
      } else if (user.role !== 'ADMIN') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch all admins
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAdmins();
    }
  }, [user]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/admins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch admins: ${response.status}`);
      }

      const data = await response.json();
      setAdmins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminData.email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    if (!newAdminData.firstName.trim()) {
      setError('Please enter a first name');
      return;
    }
    
    if (!newAdminData.lastName.trim()) {
      setError('Please enter a last name');
      return;
    }
    
    if (!newAdminData.password.trim() || newAdminData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setAddingAdmin(true);
      setError(null);

      // Step 1: Create admin in Supabase
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
        email: newAdminData.email,
        password: newAdminData.password,
        options: {
          data: {
            first_name: newAdminData.firstName,
            last_name: newAdminData.lastName,
            role: 'ADMIN',
          }
        }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!supabaseData.user) {
        throw new Error('Failed to create admin in Supabase');
      }

      // Step 2: Sync admin with backend
      const response = await fetch('http://localhost:8080/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: supabaseData.user.id,
          email: newAdminData.email,
          firstName: newAdminData.firstName,
          lastName: newAdminData.lastName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to sync admin with backend: ${response.status}`);
      }

      const addedAdmin = await response.json();
      setAdmins([...admins, addedAdmin]);
      setNewAdminData({ email: '', firstName: '', lastName: '', password: '' });
      setShowAddModal(false);
      
      // Show success message after modal closes
      setTimeout(() => {
        setSuccessMessage(`Admin ${newAdminData.email} has been created successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 100);
    } catch (err) {
      setError(err.message);
      console.error('Error adding admin:', err);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (!confirm(`Are you sure you want to remove admin access for ${adminEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete admin: ${response.status}`);
      }

      setAdmins(admins.filter(admin => admin.id !== adminId));
      setSuccessMessage(`Admin ${adminEmail} has been removed successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting admin:', err);
    }
  };

  // Fetch properties for validation
  const fetchValidationProperties = async (tab) => {
    setPropertyLoading(true);
    setError(null);
    let url = '';
    switch (tab) {
      case 'PENDING':
        url = 'http://localhost:8080/api/properties/admin/pending';
        break;
      case 'REJECTED':
        url = 'http://localhost:8080/api/properties/admin/rejected';
        break;
      case 'PUBLISHED':
        url = 'http://localhost:8080/api/properties/admin/published';
        break;
      case 'ALL':
      default:
        url = 'http://localhost:8080/api/properties/admin/all-partitioned';
        break;
    }
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      if (tab === 'ALL') {
        // Support any backend key: partitionedByStatus, partitioned, propertiesByStatus, or direct object
        let obj = data.partitionedByStatus || data.partitioned || data.propertiesByStatus || data;
        // If still not an object of arrays, try to go one level deeper
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
          const firstVal = Object.values(obj)[0];
          if (firstVal && typeof firstVal === 'object' && !Array.isArray(firstVal)) {
            obj = firstVal;
          }
        }
        // Debug: log keys and lengths
        console.log('ALL tab - partitioned keys:', Object.keys(obj));
        Object.entries(obj).forEach(([key, arr]) => {
          console.log(`Key: ${key}, Array length:`, Array.isArray(arr) ? arr.length : 'not array');
        });
        const all = [];
        Object.values(obj).forEach(arr => {
          if (Array.isArray(arr)) all.push(...arr);
        });
        console.log('ALL tab - total properties:', all.length);
        setPropertyValidationList(all);
      } else {
        setPropertyValidationList(data);
      }
    } catch (err) {
      setError(err.message);
      setPropertyValidationList([]);
    } finally {
      setPropertyLoading(false);
    }
  };

  const handleOpenReviewModal = (propertyId) => {
    setReviewPropertyId(propertyId);
    setReviewText('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/property-submission-review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyListingId: reviewPropertyId,
          message: reviewText,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      setSuccessMessage('Review submitted successfully');
      setShowReviewModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowPropertyReviews = async (property) => {
    setShowPropertyReviewsModal(true);
    setPropertyReviewsLoading(true);
    setPropertyReviewsTitle(property.title || 'No Title');
    try {
      const review = await fetchSinglePropertyReviews(property.propertyListingId || property.id, token);
      setPropertyReviewsList(review && review.message ? [review] : []);
    } catch (err) {
      setPropertyReviewsList([]);
    } finally {
      setPropertyReviewsLoading(false);
    }
  };

  // Fetch property reviews when reviews tab is active
  useEffect(() => {
    if (activeSection === 'reviews') {
      setReviewsLoading(true);
      fetchPropertyReviews(token)
        .then(data => {
          setPropertyReviews(data);
        })
        .catch(err => setError(err.message))
        .finally(() => setReviewsLoading(false));
    }
  }, [activeSection, token]);

  // Fetch on tab change
  useEffect(() => {
    if (activeSection === 'property-validation') {
      fetchValidationProperties(propertyTab);
    }
    // eslint-disable-next-line
  }, [propertyTab, activeSection]);

  if (authLoading || loading) {
    return (
      <div className="admin-portal">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'admins':
        return (
          <div className="admins-list">
            <div className="admins-list-header">
              <h2>Current Admins ({admins.length})</h2>
              <div className="admin-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add New Admin
                </button>
              </div>
            </div>
            
            {admins.length === 0 ? (
              <p className="no-admins">No admins found.</p>
            ) : (
              <div className="admins-grid">
                {admins.map((admin) => (
                  <div key={admin.id} className="admin-card">
                    <div className="admin-info">
                      <div className="admin-name">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <div className="admin-email">{admin.email}</div>
                      {admin.userName && (
                        <div className="admin-username">@{admin.userName}</div>
                      )}
                    </div>
                    <div className="admin-actions-card">
                      <button
                        className="btn btn-view"
                        onClick={() => navigate(`/profile/${admin.id}`)}
                      >
                        View Profile
                      </button>
                      {admin.id !== user.id && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                        >
                          Remove Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'subscriptions':
        return (
          <div className="subscriptions-section">
            <div className="section-header">
              <h2>Subscription Tiers</h2>
              <button className="btn btn-primary">
                + Add New Tier
              </button>
            </div>
            <p className="section-placeholder">Subscription management coming soon...</p>
          </div>
        );

      case 'property-validation':
        return (
          <div className="property-validation-section">
            <div className="section-header">
              <h2>Property Validation Requests</h2>
              <div className="property-tabs">
                {['ALL', 'PENDING', 'REJECTED', 'PUBLISHED'].map(tab => (
                  <button
                    key={tab}
                    className={`property-tab ${propertyTab === tab ? 'active' : ''}`}
                    onClick={() => setPropertyTab(tab)}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            {propertyLoading && <div className="loading">Loading properties...</div>}
            {error && <div className="alert alert-error">{error}</div>}
            {!propertyLoading && propertyValidationList.length === 0 && !error && (
              <div className="no-results">No properties found for this status.</div>
            )}
            <div className="properties-container">
              {propertyValidationList.map(property => {
                const propertyId = property.id || property.propertyListingId;
                const handleStatusChange = async (newStatus) => {
                  try {
                    await updatePropertyStatus(propertyId, newStatus, token);
                    setSuccessMessage(`Property status updated to ${newStatus}`);
                    // Remove property from current list (optimistic update)
                    setPropertyValidationList(prev => prev.filter(p => (p.id || p.propertyListingId) !== propertyId));
                    // Optionally, refetch properties for more accuracy
                    // fetchValidationProperties(propertyTab);
                  } catch (err) {
                    setError(err.message);
                  }
                };
                return (
                  <div
                    key={propertyId}
                    className="property-card"
                    onClick={() => navigate(`/property/${propertyId}`)}
                  >
                    <div className="property-image">
                      <img src={(property.bannerImage && property.bannerImage.imageUrl) || 'https://via.placeholder.com/400x300?text=Image+Missing'} alt={property.title} />
                    </div>
                    <div className="property-content">
                      <div className="property-price">{property.price ? property.price + ' EGP' : 'N/A'}</div>
                      <h3 className="property-title">{property.title ? property.title : 'No Title'}</h3>
                      <p className="property-location">{[property.city, property.state].filter(Boolean).join(', ')}</p>
                      <button className="btn btn-view" style={{width: '100%', margin: '0.5rem 0'}} onClick={e => { e.stopPropagation(); handleShowPropertyReviews(property); }}>Show Reviews</button>
                      {property.description && (
                        <p className="property-description">{property.description}</p>
                      )}
                      <div className="property-features">
                        <span className="feature">{property.bedrooms} beds</span>
                        <span className="feature">{property.bathrooms} baths</span>
                      </div>
                      <div className="property-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
                        <button className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.95rem'}} onClick={e => { e.stopPropagation(); handleStatusChange('PUBLISHED'); }}>Publish</button>
                        <button className="btn btn-danger" style={{padding: '0.5rem 1rem', fontSize: '0.95rem'}} onClick={e => { e.stopPropagation(); handleStatusChange('REJECTED'); }}>Reject</button>
                        <button className="btn btn-secondary" style={{padding: '0.5rem', minWidth: '40px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={e => { e.stopPropagation(); handleOpenReviewModal(propertyId); }} title="Write Review">
                          <FaRegCommentDots size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'users-listing':
        return <UsersListing />;

      default:
        return null;
    }
  };

  return (
    <div className="admin-portal">
      <div className="admin-portal-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2>Admin Portal</h2>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeSection === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveSection('admins')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Manage Admins
            </button>
            <button 
              className={`sidebar-link ${activeSection === 'users-listing' ? 'active' : ''}`}
              onClick={() => setActiveSection('users-listing')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Users Listing
            </button>
            <button 
              className={`sidebar-link ${activeSection === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveSection('subscriptions')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              Subscription Tiers
            </button>
            <button 
              className={`sidebar-link ${activeSection === 'property-validation' ? 'active' : ''}`}
              onClick={() => setActiveSection('property-validation')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Property Validation
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="admin-main-content">
          <div className="admin-portal-container">
            {error && (
              <div className="alert alert-error">
                {error}
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Admin</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin}>
              <div className="form-group">
                <label htmlFor="adminEmail">Email Address</label>
                <input
                  type="email"
                  id="adminEmail"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                  placeholder="Enter admin email address"
                  required
                  disabled={addingAdmin}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="adminFirstName">First Name</label>
                <input
                  type="text"
                  id="adminFirstName"
                  value={newAdminData.firstName}
                  onChange={(e) => setNewAdminData({...newAdminData, firstName: e.target.value})}
                  placeholder="Enter first name"
                  required
                  disabled={addingAdmin}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="adminLastName">Last Name</label>
                <input
                  type="text"
                  id="adminLastName"
                  value={newAdminData.lastName}
                  onChange={(e) => setNewAdminData({...newAdminData, lastName: e.target.value})}
                  placeholder="Enter last name"
                  required
                  disabled={addingAdmin}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="adminPassword">Password</label>
                <input
                  type="password"
                  id="adminPassword"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                  placeholder="Enter password (min 5 characters)"
                  required
                  minLength="5"
                  disabled={addingAdmin}
                />
                <p className="form-help">
                  Create a new admin account. The admin will be able to sign in with this email and password.
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={addingAdmin}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addingAdmin}
                >
                  {addingAdmin ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write Review</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
              placeholder="Write your review here..."
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitReview} disabled={!reviewText.trim()}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Property Reviews Modal */}
      {showPropertyReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowPropertyReviewsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reviews for: {propertyReviewsTitle}</h2>
              <button className="modal-close" onClick={() => setShowPropertyReviewsModal(false)}>×</button>
            </div>
            {propertyReviewsLoading ? (
              <div className="loading">Loading reviews...</div>
            ) : propertyReviewsList.length === 0 ? (
              <div className="no-results">No reviews found for this property.</div>
            ) : (
              <ul style={{padding: 0, listStyle: 'none'}}>
                {propertyReviewsList.map((review, idx) => (
                  <li key={idx} style={{marginBottom: '1rem', background: '#FDFAF6', borderRadius: '8px', padding: '1rem'}}>
                    <div style={{fontWeight: 600, color: '#00a676'}}>Review:</div>
                    <div>{review.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
