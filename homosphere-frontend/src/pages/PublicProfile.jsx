import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PublicProfile.css";
import "../styles/public-profile-info.css";
import { fetchPublicUserData } from "../services/userApi";
import { fetchPublishedPropertiesByUser } from "../services/propertyApi";
import ProfileInfo from "../components/profile/ProfileInfo";
import PublicPropertyCard from "../components/PublicPropertyCard";

export default function PublicProfile({ id: propId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const params = useParams();
  const id = propId || params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await fetchPublicUserData(id);
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
        const props = await fetchPublishedPropertiesByUser(id);
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
  }, [id]);

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
  if (!user)
    return (
      <div className="public-profile-container">
        <div className="error-message">No user data loaded.</div>
      </div>
    );

  return (
    <div className="public-profile-outer">
      <ProfileInfo tempUser={user} editMode={false} publicMode={true} />
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
