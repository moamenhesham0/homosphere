import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { fetchUserData } from "../services/userApi";
import {
  getAllPropertyListings,
  getUserPropertyListings,
  getUserPropertyListingTabs,
  getPropertyListingById,
  submitPropertyListing,
  saveDraftPropertyListing,
  updateDraftPropertyListing,
  editPropertyListing,
  deletePropertyListing
} from "../services/apiPropertyListing";
import EnterPasswordWindow from "../components/enterPasswordWindow";
import useDeleteUser from "../hooks/useDeleteUser";
import { supabase } from "../utils/supabase";
import PasswordChangeWindow from "../components/passwordChangeWindow";
import { uploadImageToCloudflare, uploadMultipleImages } from "../services/cloudflareUpload";

export default function Profile() {
  const navigate = useNavigate();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Store the original API data to preserve fields we don't edit
  const [originalData, setOriginalData] = useState(null);

  const [user, setUser] = useState({
    id:"",
    firstname: "",
    lastname: "",
    username: "",
    role: "",
    email: "",
    whatsapp: "",
    telegram: "",
    location: "",
    bio: "",
    photo: "" // store only the filename
  });

  const [tempUser, setTempUser] = useState({ ...user });

  // Property Dashboard state
  const [propertyTabs, setPropertyTabs] = useState(["ALL"]);
  const [userListings, setUserListings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(null);

  // Track which listing is being edited
  const [editingListingId, setEditingListingId] = useState(null);

  // Fetch user data from API
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        // Get user ID from Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("No active session");
          navigate('/signin');
          return;
        }
        const userId = session.user.id;
        const mappedUser = await fetchUserData(userId);
        setUser({ ...mappedUser, id: userId });
        setTempUser({ ...mappedUser, id: userId });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [navigate]);

  // Fetch property tabs once user id is known
  useEffect(() => {
    const loadTabs = async () => {
      if (!user?.id) return;
      try {
        const tabs = await getUserPropertyListingTabs(user.id);
        // Filter out null/undefined values and ensure we have valid strings
        const validTabs = Array.isArray(tabs) ? tabs.filter(tab => tab != null && tab !== '') : [];
        console.log('Loaded property tabs:', validTabs);
        setPropertyTabs(["ALL", ...validTabs]);
      } catch (err) {
        console.error("Error fetching property tabs:", err);
        setPropertyTabs(["ALL"]); // fallback to ALL only
      }
    };
    loadTabs();
  }, [user?.id]);

  // Fetch user's property listings once user id is known
  useEffect(() => {
    const loadListings = async () => {
      if (!user?.id) return;
      try {
        setListingsLoading(true);
        setListingsError(null);
        // Fetch all listings for this user (including drafts)
        const listings = await getUserPropertyListings(user.id);
        console.log('User property listings fetched:', listings);
        setUserListings(listings || []);
      } catch (err) {
        console.error("Error fetching property listings:", err);
        setListingsError(err.message || "Failed to load listings");
        setUserListings([]);
      } finally {
        setListingsLoading(false);
      }
    };
    loadListings();
  }, [user?.id]);

  const filteredListings = useMemo(() => {
    if (selectedTab === "ALL") return userListings;
    return userListings.filter((l) => {
      return l?.status === selectedTab;
    });
  }, [userListings, selectedTab]);

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch("http://localhost:8080/api/media/upload", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        const data = await response.json();
        const url = data.url;
        console.log("Uploaded image URL:", url);
        const filename = url.split("/").pop();
        setTempUser((prev) => ({ ...prev, photo: filename }));
        setUser((prev) => ({ ...prev, photo: filename }));
      } catch (err) {
        setError(`Photo upload failed: ${err.message}`);
        console.error("Error uploading photo:", err);
      }
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage("");
      const payload = {
        email: tempUser.email,
        firstName: tempUser.firstname,
        lastName: tempUser.lastname,
        userName: tempUser.username,
        location: tempUser.location,
        phone: tempUser.whatsapp,
        bio: tempUser.bio,
        role: tempUser.role,
        photo: tempUser.photo, // send only filename to backend
        googleOuthId: originalData?.googleOuthId || 0,
        password: originalData?.password || "",
        isVerified: originalData?.isVerified || null,
        verificationToken: originalData?.verificationToken || null,
        status: originalData?.status || null,
        failedLoginAttempt: originalData?.failedLoginAttempt || null,
        banExpiredDate: originalData?.banExpiredDate || null
      };
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `http://localhost:8080/api/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setOriginalData(updatedData);
      setUser(tempUser);
      setEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to save changes: ${err.message}`);
      console.error("Error saving user data:", err);
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    setTempUser(user);
    setEditMode(false);
    setError(null);
    setSuccessMessage("");
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUser();

      if (result.success) {
        // Navigate to sign in page after successful deletion
        navigate('/signin');
      } else {
        setError(result.error || 'Failed to delete account');
        setShowDeleteModal(false);
      }
    } catch {
      setError('Failed to delete account');
      setShowDeleteModal(false);
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,  // New password
      });
      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setSuccessMessage('Password changed successfully!');
      setShowPasswordModal(false);
    } catch {
      setError('Failed to change password');
    }
  };

  // Property listing handlers
  const handleCreateListing = () => {
    navigate('/property-listing-form');
  };

  const handleEditListing = (listing) => {
    navigate(`/property-listing-form?id=${listing.id}`);
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await deletePropertyListing(listingId);
      setUserListings(prev => prev.filter(l => l.id !== listingId));
      setSuccessMessage("Listing deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to delete listing: ${err.message}`);
    }
  };





  if (loading || deleteLoading) {
    return (
      <div className="profile-page">
        <div className="loading">{deleteLoading ? 'Deleting account...' : 'Loading profile...'}</div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <div className="left-panel">
        <div className="photo-container">
          <img
            src={tempUser.photo ? `https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${tempUser.photo}` : "https://via.placeholder.com/200"}
            alt="User"
            className="profile-photo"
          />
          {editMode && (
            <>
              <label className="upload-btn">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
              <button className="delete-photo-btn" onClick={() => {
                setTempUser((prev) => ({ ...prev, photo: "" }));
                setUser((prev) => ({ ...prev, photo: "" }));
              }}>
                Delete Photo
              </button>
            </>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="section">
          <h3>Profile Information</h3>
          <div className="field-row">
            <div className="field">
              <label>Username</label>
              <input
                name="username"
                value={tempUser.username}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="field">
              <label>First Name</label>
              <input
                name="firstname"
                value={tempUser.firstname}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Last Name</label>
              <input
                name="lastname"
                value={tempUser.lastname}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="field">
              <label>Role</label>
              <input
                name="role"
                value={tempUser.role}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Location</label>
              <input
                name="location"
                value={tempUser.location}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Contact Info</h3>
          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input
                name="email"
                value={tempUser.email}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="field">
              <label>WhatsApp</label>
              <input
                name="whatsapp"
                value={tempUser.whatsapp}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Telegram</label>
              <input
                name="telegram"
                value={tempUser.telegram}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h3>About the User</h3>
          <textarea
            name="bio"
            value={tempUser.bio}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="section">
          <h3>Property Dashboard</h3>

          <div className="property-dashboard-header">
            <div className="property-tabs">
              {propertyTabs.filter(tab => tab != null).map((tab) => (
                <button
                  key={tab}
                  className={`property-tab ${selectedTab === tab ? "active" : ""}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {String(tab).replace(/_/g, " ")}
                </button>
              ))}
            </div>
            <button className="create-listing-btn" onClick={handleCreateListing}>
              + Create Listing
            </button>
          </div>

          {listingsLoading && (
            <div className="loading">Loading your listings...</div>
          )}
          {listingsError && (
            <div className="error-message">{listingsError}</div>
          )}

          {!listingsLoading && !listingsError && (
            <div className="property-list">
              {filteredListings.length === 0 ? (
                <div className="empty-state">No listings found in {selectedTab} status.</div>
              ) : (
                <div className="properties-grid">
                  {filteredListings.map((l) => {
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

                    // Determine if can edit based on status
                    const canEdit = ["PUBLISHED"].includes(status);
                    const canEditDraft = ["DRAFT", "REQUIRES_CHANGES"].includes(status);

                    return (
                      <div className="property-card" key={l?.id}>
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
                              <span className="feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                {bedrooms} beds
                              </span>
                            )}
                            {bathrooms > 0 && (
                              <span className="feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2 7h20M4 11h1v8c0 1-1 2-2 2s-2-1-2-2v-8zm14 0h1v8c0 1-1 2-2 2s-2-1-2-2v-8z"></path>
                                </svg>
                                {bathrooms} baths
                              </span>
                            )}
                            {area > 0 && (
                              <span className="feature">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="3" width="18" height="18"></rect>
                                </svg>
                                {area.toLocaleString()} sqft
                              </span>
                            )}
                          </div>

                          <div className="property-actions">
                            <button
                              className="action-btn view-btn"
                              onClick={() => navigate(`/property/${l?.id}`)}
                            >
                              View Details
                            </button>
                            {canEdit && (
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEditListing(l)}
                              >
                                Edit
                              </button>
                            )}
                            {canEditDraft && (
                              <button
                                className="action-btn edit-draft-btn"
                                onClick={() => handleEditListing(l)}
                              >
                                Edit Draft
                              </button>
                            )}
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteListing(l?.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-buttons">
          {!editMode ? (
            <>
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
              <button className="change-password-btn" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
              <button className="delete-account-btn" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={saveChanges} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="cancel-btn" onClick={cancelChanges} disabled={saving}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <EnterPasswordWindow
          onClose={() => setShowDeleteModal(false)}
          onSubmit={handleDeleteAccount}
        />
      )}

      {showPasswordModal && (
        <PasswordChangeWindow
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      )}
    </div>
  );
}