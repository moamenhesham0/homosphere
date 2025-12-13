import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { fetchUserData } from "../services/userApi";
import EnterPasswordWindow from "../components/enterPasswordWindow";
import useDeleteUser from "../hooks/useDeleteUser";
import { supabase } from "../utils/supabase";
import PasswordChangeWindow  from "../components/passwordChangeWindow";

export default function Profile() {
  const navigate = useNavigate();
  const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();

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

  const handleDeleteAccount = async (password) => {
    try {
      const result = await deleteUser();

      if (result.success) {
        // Navigate to sign in page after successful deletion
        navigate('/signin');
      } else {
        setError(result.error || 'Failed to delete account');
        setShowDeleteModal(false);
      }
    } catch (err) {
      setError('Failed to delete account');
      setShowDeleteModal(false);
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,  // New password
      });
      if (error) {
        setPasswordError(error.message);
        return;
      }
      setError(null);
      setSuccessMessage('Password changed successfully!');
      setShowPasswordModal(false);
    } catch (err) {
      setError('Failed to change password');
    }
  }

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
              <button className="save-btn" onClick={saveChanges}>
                Save
              </button>
              <button className="cancel-btn" onClick={cancelChanges}>
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

