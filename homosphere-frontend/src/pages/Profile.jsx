import { useState, useEffect, useMemo, use } from "react";
import ProfileTabs from "../components/profile/ProfileTabs";
import "../styles/ProfileSidebar.css";
import ProfileInfo from "../components/profile/ProfileInfo";
import Inquiries from "../components/profile/Inquiries";
import SavedProperties from "../components/profile/SavedProperties";
import AgentDashboard from "../components/profile/AgentDashboard";
import ManagementRequests from "../components/profile/ManagementRequests";
import PropertyDashboard from "../components/profile/PropertyDashboard";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Profile.css";
import { fetchUserData, fetchPrivateUserData } from "../services/userApi";
import {
  getUserPropertyListings,
  getUserPropertyListingTabs,
  deletePropertyListing
} from "../services/apiPropertyListing";
import useDeleteUser from "../hooks/useDeleteUser";
import { supabase } from "../utils/supabase";
import PublicProfile from "./PublicProfile";
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { getAuthToken } from '../utils/authUtils';
import SuccessModal from '../components/SuccessModal';


export default function Profile() {
  const params = useParams();
  const { token } = useAuth();
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
    fullname: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    photo: "" // store only the filename
  });

  const [tempUser, setTempUser] = useState({ ...user, fullname: `${user.firstname} ${user.lastname}` });
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

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
    "Properties",
    "Inquiries",
    "Management Requests",
    "Public Profile",
    "Saved Properties"
  ];

  // Fetch user data from API
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (params.id) {
          // Admin viewing another user's private profile
          const mappedUser = await fetchPrivateUserData(params.id, token);
          setUser({ ...mappedUser, id: params.id });
          setTempUser({ ...mappedUser, id: params.id, fullname: `${mappedUser.firstname} ${mappedUser.lastname}` });
          
          setError(null);
        } else {
          // Get user ID from Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setError("No active session");
            navigate('/signin');
            return;
          }
          const userId = session.user.id;
          const mappedUser = await fetchPrivateUserData(userId, session.access_token);
          setUser({ ...mappedUser, id: userId });
          setTempUser({ ...mappedUser, id: userId, fullname: `${mappedUser.firstname} ${mappedUser.lastname}` });
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [navigate, params.id, token]);

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
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        const data = await response.json();
        const url = data.url;
        console.log("Uploaded image URL:", url);
        const filename = url.split("/").pop();
        console.log("Extracted filename:", filename);

        const updatedUser = { ...tempUser, photo: filename };
        setTempUser((prev) => ({ ...prev, photo: filename }));
        setUser((prev) => ({ ...prev, photo: filename }));
        saveChanges(updatedUser);
      } catch (err) {
        setError(`Photo upload failed: ${err.message}`);
        console.error("Error uploading photo:", err);
      }
    }
  };

  const saveChanges = async (userDataOverride) => {
    const currentUser = (userDataOverride && !userDataOverride.nativeEvent) ? userDataOverride : tempUser;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage("");
      console.log("Saving user data:", currentUser);
      const nameParts = currentUser.fullname?.trim().split(/\s+/) || [];
      const newFirstName = nameParts[0] || "";
      const newLastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        email: currentUser.email,
        firstName: newFirstName,
        lastName: newLastName,
        userName: currentUser.username, // backend expects userName
        location: currentUser.location,
        phone: currentUser.phone,
        bio: currentUser.bio,
        role: currentUser.role,
        photo: currentUser.photo ? currentUser.photo.split('/').pop() : "",
        googleOuthId: originalData?.googleOuthId || 0,
        password: originalData?.password || "",
        isVerified: originalData?.isVerified || null,
        verificationToken: originalData?.verificationToken || null,
        status: originalData?.status || null,
        failedLoginAttempt: originalData?.failedLoginAttempt || null,
        banExpiredDate: originalData?.banExpiredDate || null
      };
      console.log("saving Payload to be sent to backend:", payload);
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

  const revertFields = (fields) => {
    setTempUser((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = user[field];
      });
      return next;
    });
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
    } catch (err) {
      setError(`Failed to delete listing: ${err.message}`);
    }
  };


useEffect(() => {
  const getSubscriptionStatus = async () => {
    try {
      const session = await getAuthToken(); // Must await this async function
      console.log("Session token:", session);
      
      if (!session) {
        console.log("No session token found");
        return null;
      }
      
      const subscription = await axios.get(`http://localhost:8080/api/user-subscriptions/my-subscriptions`, {
        headers: {
          'Authorization': `Bearer ${session}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("User subscription data:", subscription.data);
      return subscription.data;
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      console.error("Error response:", error.response?.data);
      return null;
    }
  };
  
  getSubscriptionStatus().then(data => {
    if (data) {
      setSubscriptionStatus(data);
      console.log("Subscription status set:", data);
    }
  }).catch(error => {
    console.error("Promise error:", error);
  });   
}, []);

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
            <ProfileInfo 
              tempUser={tempUser} 
              editMode={editMode} 
              handleChange={handleChange}
              handlePhotoChange={handlePhotoChange}
              handleDeletePhoto={() => {
                setTempUser((prev) => ({ ...prev, photo: "" }));
                setUser((prev) => ({ ...prev, photo: "" }));
              }}
              subscriptionData={subscriptionStatus?.[0]}
              onSave={saveChanges}
              onCancel={revertFields}
            />
        )}
        {tab === 1 && (
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
        {tab === 2 && <AgentDashboard />}
        {tab === 3 && <ManagementRequests />}
        {tab === 4 && <PublicProfile id={user.id} />}
        {tab === 5 && <SavedProperties userId={user.id} />}
      </div>
      
      {/* Success Modal */}
      {successMessage && (
        <SuccessModal 
          message={successMessage} 
          onClose={() => setSuccessMessage("")} 
        />
      )}
    </div>
  );
}