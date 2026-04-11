import { useState, useRef } from 'react';
import './ProfileInfo.css';
import useDeleteUser from "../../hooks/useDeleteUser";
import PasswordChangeWindow from "../../components/passwordChangeWindow";
import EnterPasswordWindow from "../../components/enterPasswordWindow";
import { supabase } from "../../utils/supabase";

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const VerticalDotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <circle cx="12" cy="5" r="2"></circle>
    <circle cx="12" cy="12" r="2"></circle>
    <circle cx="12" cy="19" r="2"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function ProfileInfo({ tempUser, editMode, handleChange, handlePhotoChange, publicMode, subscriptionData, onSave, onCancel }) {
  const fileInputRef = useRef(null);
  const fullName = [tempUser.firstname, tempUser.lastname].filter(Boolean).join(" ");
  const [showMenu, setShowMenu] = useState(false);

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  const isEditing = (section) => editMode || editingSection === section;

  // Helper to trigger edit for a specific section (logic to be added by you)
  const handleEditSection = (sectionName) => {
    setEditingSection(prev => prev === sectionName ? null : sectionName);
  };

  const handleSaveSection = (sectionName) => {
    if (onSave) {
      onSave();
    }
    setEditingSection(null);
  };

  const handleCancelSection = (sectionName) => {
    if (onCancel) {
        let fields = [];
        if (sectionName === 'personal') fields = ['firstname', 'email', 'phone', 'role'];
        if (sectionName === 'bio') fields = ['bio'];
        if (sectionName === 'location') fields = ['location'];
        onCancel(fields);
    }
    setEditingSection(null);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handlePasswordChange = async (newPassword) => {
      const { error } = await supabase.auth.updateUser({
      password: newPassword,
      });
      if (error) {
      throw new Error(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUser();

      if (result.success) {
        // Navigate to sign in page after successful deletion
        navigate('/signin');
      } else {
        setShowDeleteModal(false);
      }
    } catch {
      setShowDeleteModal(false);
    }
  };

  const handleViewPublicProfile = () => {
    console.log('View public profile clicked');
    setShowMenu(false);
    // Add your view public profile logic here
  };

  const getInitial = () => {
    console.log("Getting initial for user:", tempUser);
    if (tempUser.firstname && tempUser.firstname.length > 0) {
      return tempUser.firstname[0].toUpperCase();
    }
    return '?';
  };

  return (
    <div className="profile-info-card">
      {/* Menu Button */}
      {!publicMode && (
        <div className="menu-container">
          <button className="menu-button" onClick={handleMenuToggle}>
            <VerticalDotsIcon />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button className="menu-item" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
              <button className="menu-item" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
              <button className="menu-item" onClick={handleViewPublicProfile}>
                View Public Profile
              </button>
              <button className="menu-item" onClick={handleMenuToggle}>
                Subscription Plan
              </button>
            </div>
          )}
        </div>
      )}
      {/* Left Column */}
      <div className="profile-left-column">
        
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          {/* Note: Photo section usually has its own specific edit button layout, 
              but we can add the corner pen here too if desired */}
          <div className="profile-photo-background"></div>
          <div className="profile-photo-wrapper">
          {tempUser.photo ? (
            <img className="profile-photo-placeholder" src={`https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${tempUser.photo}`} alt={fullName} />
          ) : (
            <div className="profile-photo-placeholder">{getInitial()}</div>
          )}
             {/* Small pen strictly for the image circle */}
            {!publicMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <button className="profile-photo-edit-btn" onClick={triggerFileSelect}>
                   <PencilIcon />
                </button>
              </>
            )}
          </div>
          <div className="profile-photo-label">
            <h3>Your Photo</h3>
            <p>This will be displayed on your profile</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="profile-info-details">
          {/* --- The Pen or Check/X --- */}
          {!publicMode && (
            isEditing('personal') ? (
              <div className="section-actions">
                <button className="section-save-btn" onClick={() => handleSaveSection('personal')}>
                  <CheckIcon />
                </button>
                <button className="section-cancel-btn" onClick={() => handleCancelSection('personal')}>
                  <XIcon />
                </button>
              </div>
            ) : (
              <button className="section-edit-btn" onClick={() => handleEditSection('personal')}>
                <PencilIcon />
              </button>
            )
          )}
          
          <h3>Personal information</h3>
          
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              {isEditing('personal') ? (
                <input
                  type="text"
                  name="fullname"
                  value={tempUser.fullname || ''}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              ) : (
                <div className="input-display">{fullName}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Email address</label>
            <div className="input-with-icon">
              <span className="input-icon">✉️</span>
                <div className="input-display">{tempUser.email}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Mobile number</label>
            <div className="input-with-icon">
              <span className="input-icon">📱</span>
              {isEditing('personal') ? (
                <input
                  type="tel"
                  name="phone"
                  value={tempUser.phone || ''}
                  onChange={handleChange}
                  placeholder="+966..."
                />
              ) : (
                <div className="input-display">{tempUser.phone || 'Not provided'}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
              <div className="input-display">{tempUser.role || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="profile-right-column">
        
        {/* Bio Section */}
        <div className="profile-bio-section">
          {/* --- The Pen or Check/X --- */}
          {!publicMode && (
            isEditing('bio') ? (
              <div className="section-actions">
                <button className="section-save-btn" onClick={() => handleSaveSection('bio')}>
                  <CheckIcon />
                </button>
                <button className="section-cancel-btn" onClick={() => handleCancelSection('bio')}>
                  <XIcon />
                </button>
              </div>
            ) : (
              <button className="section-edit-btn" onClick={() => handleEditSection('bio')}>
                <PencilIcon />
              </button>
            )
          )}

          <h3>Bio</h3>
          {isEditing('bio') ? (
            <textarea
              name="bio"
              value={tempUser.bio || ''}
              onChange={handleChange}
              rows="6"
            />
          ) : (
            <p>{tempUser.bio || 'No bio provided'}</p>
          )}
        </div>

        {/* Location Section */}
        <div className="profile-location-section">
          {/* --- The Pen or Check/X --- */}
          {!publicMode && (
            isEditing('location') ? (
              <div className="section-actions">
                <button className="section-save-btn" onClick={() => handleSaveSection('location')}>
                  <CheckIcon />
                </button>
                <button className="section-cancel-btn" onClick={() => handleCancelSection('location')}>
                  <XIcon />
                </button>
              </div>
            ) : (
              <button className="section-edit-btn" onClick={() => handleEditSection('location')}>
                <PencilIcon />
              </button>
            )
          )}

          <h3>Location</h3>
          {isEditing('location') ? (
            <input
              type="text"
              name="location"
              value={tempUser.location || ''}
              onChange={handleChange}
              placeholder="e.g. Riyadh, Saudi Arabia"
              className="location-input" 
            />
          ) : (
            <div className="location-tags">
              <h4>{tempUser.location || 'Not specified'}</h4>
            </div>
          )}
        </div>

        {/* Subscription Section */}
        <div className="profile-subscription-section">
          <div className="subscription-header">
          <h3>Subscription info</h3>
                <span className={`subscription-badge ${subscriptionData?.status?.toLowerCase() || 'inactive'}`}>
                  {subscriptionData?.status || 'Inactive'}
                </span>
            </div>
          <div className="subscription-details">
            <div className="subscription-item">
              <label>Current Plan</label>
              <div className="subscription-value">
                <span className={`plan-badge ${subscriptionData?.subscription?.name?.toLowerCase().replace(/\s+/g, '-') || 'free'}`}>
                  {subscriptionData?.subscription?.name || 'Free'}
                </span>
              </div>
            </div>
            <div className="subscription-item">
              <label>Frequency</label>
              <div className="subscription-value">
                {subscriptionData?.frequency ? subscriptionData.frequency.charAt(0).toUpperCase() + subscriptionData.frequency.slice(1).toLowerCase() : 'N/A'}
              </div>
            </div>
            <div className="subscription-item">
              <label>Start Date</label>
              <div className="subscription-value">
                {subscriptionData?.startDate 
                  ? new Date(subscriptionData.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'N/A'
                }
              </div>
            </div>
            <div className="subscription-item">
              <label>End Date</label>
              <div className="subscription-value">
                {subscriptionData?.endDate 
                  ? new Date(subscriptionData.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'N/A'
                }
              </div>
            </div>
            {subscriptionData?.cancellationDate && (
              <div className="subscription-item">
                <label>Cancellation Date</label>
                <div className="subscription-value">
                  {new Date(subscriptionData.cancellationDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            )}
            {subscriptionData?.cancellationReason && (
              <div className="subscription-item">
                <label>Cancellation Reason</label>
                <div className="subscription-value">
                  {subscriptionData.cancellationReason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        {showPasswordModal && (
          <PasswordChangeWindow
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handlePasswordChange}
          />
        )}
        {showDeleteModal && (
          <EnterPasswordWindow
            onClose={() => setShowDeleteModal(false)}
            onSubmit={handleDeleteAccount}
          />
        )}
    </div>
  );
}