import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import '../styles/AdminPortal.css';

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
            </div>
            <p className="section-placeholder">Property validation requests coming soon...</p>
          </div>
        );

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
    </div>
  );
}
