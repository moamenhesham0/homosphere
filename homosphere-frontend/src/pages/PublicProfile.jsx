import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PublicProfile.css";
import "../styles/public-profile-info.css";
import { fetchPublicUserData } from "../services/userApi";
import { fetchPublishedPropertiesByUser } from "../services/propertyApi";
import ProfileInfo from "../components/profile/ProfileInfo";
import PublicPropertyCard from "../components/PublicPropertyCard";
import { useAuth } from "../contexts/AuthContext";

export default function PublicProfile({ id: propId }) {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const params = useParams();
  const id = propId || params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (!id) return;
        // Only pass token and isAdmin if user is admin
        const isAdmin = user && user.role && user.role.toLowerCase() === "admin";
        const data = await fetchPublicUserData(id, isAdmin ? token : undefined, isAdmin);
        setUser({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          username: data.username || "",
          email: data.email || "",
          photo: data.photo || "",
          location: data.location || "",
          whatsapp: data.whatsapp || "",
          telegram: data.telegram || "",
          bio: data.bio || "",
        });
        // Fetch published properties for this user
        const props = await fetchPublishedPropertiesByUser(id, isAdmin ? token : undefined);
        setProperties(props);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data or properties:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id, token, user]);

  if (loading)
    return (
      <div className="public-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="public-profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  if (!userData)
    return (
      <div className="public-profile-container">
        <div className="error-message">No user data loaded.</div>
      </div>
    );

  return (
    <div className="public-profile-outer">
      <ProfileInfo tempUser={userData} editMode={false} publicMode={true} />
      <div className="published-ads">Published Properties: {properties.length}</div>
      <div className="properties-container">
        <h2>Published Properties</h2>
        {properties.length === 0 && !loading && <div>No published properties found.</div>}
        {properties.map((property) => (
          <PublicPropertyCard
            key={property.propertyListingId || property.id}
            property={property}
            onClick={() => navigate(`/property/${property.propertyListingId || property.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
