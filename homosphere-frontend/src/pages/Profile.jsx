import { useState, useEffect, useMemo } from "react";
import ProfileTabs from "../components/profile/ProfileTabs";
import "../styles/ProfileSidebar.css";
import ProfileInfo from "../components/profile/ProfileInfo";
import Security from "../components/profile/Security";
import Inquiries from "../components/profile/Inquiries";
import AgentDashboard from "../components/profile/AgentDashboard";
import ManagementRequests from "../components/profile/ManagementRequests";
import PropertyDashboard from "../components/profile/PropertyDashboard";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { fetchUserData } from "../services/userApi";
import {
  getUserPropertyListings,
  getUserPropertyListingTabs,
  deletePropertyListing
} from "../services/apiPropertyListing";
import EnterPasswordWindow from "../components/enterPasswordWindow";
import useDeleteUser from "../hooks/useDeleteUser";
import { supabase } from "../utils/supabase";
import PasswordChangeWindow from "../components/passwordChangeWindow";
import PublicProfile from "./PublicProfile";


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
    id: "",
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

  // Tab state for profile sections
  const [tab, setTab] = useState(0);
  const tabLabels = [
    "Profile",
    "Security",
    "Properties",
    "Inquiries",
    "Management Requests",
    "Public Profile"
  ];

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
        userName: tempUser.username, // backend expects userName
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
      // Remove any accidental 'username' key from payload
      if (payload.username !== undefined) delete payload.username;
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
      // Map backend userName to frontend username
      setOriginalData(updatedData);
      setUser((prev) => ({
        ...prev,
        ...updatedData,
        username: updatedData.userName || prev.username,
        location: updatedData.location || prev.location
      }));
      setTempUser((prev) => ({
        ...prev,
        ...updatedData,
        username: updatedData.userName || prev.username,
        location: updatedData.location || prev.location
      }));
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
    try {
      await deletePropertyListing(listingId);
      // Reload listings from backend after successful deletion
      if (user?.id) {
        const listings = await getUserPropertyListings(user.id);
        setUserListings(listings || []);
      }
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
    <div className="profile-page" style={{ display: 'flex', minHeight: '100vh', background: '#f5f5dc' }}>
      <ProfileTabs tab={tab} setTab={setTab} tabLabels={tabLabels} />
      <div className="profile-main-content">
        {tab === 0 && (
          <>
            <ProfileInfo 
              tempUser={tempUser} 
              editMode={editMode} 
              handleChange={handleChange}
              handlePhotoChange={handlePhotoChange}
              handleDeletePhoto={() => {
                setTempUser((prev) => ({ ...prev, photo: "" }));
                setUser((prev) => ({ ...prev, photo: "" }));
              }}
            />
            <div className="profile-buttons">
              {!editMode ? (
                <>
                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    Edit Profile
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
          </>
        )}
        {tab === 1 && (
          <Security
            onChangePassword={() => setShowPasswordModal(true)}
            onDeleteAccount={() => setShowDeleteModal(true)}
          />
        )}
        {tab === 2 && (
          <PropertyDashboard
            propertyTabs={propertyTabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            handleCreateListing={handleCreateListing}
            listingsLoading={listingsLoading}
            listingsError={listingsError}
            filteredListings={filteredListings}
            navigate={navigate}
            handleEditListing={handleEditListing}
            handleDeleteListing={handleDeleteListing}
          />
        )}
        {tab === 3 && <AgentDashboard />}
        {tab === 4 && <ManagementRequests />}
        {tab === 5 && <PublicProfile id={user.id} />}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
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
    </div>
  );
}