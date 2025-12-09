import { useState, useEffect } from "react";
import "./PublicProfile.css";
import { fetchUserData } from "../services/userApi";

export default function PublicProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    publishedAds: 0,
    photo: "",
    email: "",
    whatsapp: "",
    location: "",
  });

  const [ads, setAds] = useState([]);

  // Filters state (location seeded from user)
  const [filters, setFilters] = useState({
    purpose: "All",
    location: "",
    propertyType: "All",
    beds: null,
    baths: null,
    priceMin: "",
    priceMax: "",
  });

  // Fetch user data from API
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        // Map API response to user state
        const { data } = await fetchUserData(tempUser.id);
        const mappedUser = {
          firstname: data.firstName || "",
          lastname: data.lastName || "",
          publishedAds: 0, // This would come from another API endpoint
          photo: data.photo || "", // Map photo filename from API
          email: data.email || "",
          whatsapp: data.phone || "",
          location: data.location || "",
        };
        setUser(mappedUser);
        setFilters((f) => ({ ...f, location: mappedUser.location }));
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const propertyTypeOptionsByPurpose = {
    Sale: [
      "Apartments for Sale",
      "Villas For Sale",
      "Vacation Homes for Sale",
      "Commercial for Sale",
      "Buildings & Lands",
    ],
    Rent: [
      "Apartments for Rent",
      "Villas for Rent",
      "Vacation Homes for Rent",
    ],
    All: ["All"],
  };

  const propertyTypeOptions = propertyTypeOptionsByPurpose[filters.purpose];

  // Ensure propertyType stays valid when purpose changes
  useEffect(() => {
    if (!propertyTypeOptions.includes(filters.propertyType)) {
      setFilters((f) => ({ ...f, propertyType: "All" }));
    }
  }, [filters.purpose]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setUser({ ...user, photo: photoURL });
    }
  };

  const clearFilters = () => {
    setFilters({
      purpose: "All",
      location: user.location,
      propertyType: "All",
      beds: null,
      baths: null,
      priceMin: "",
      priceMax: "",
    });
  };

  return (
    <div className="public-profile-container">
      <div className="profile-left">
        <div className="profile-photo">
          {user.photo ? (
            <img src={`https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${user.photo}`} alt="Profile" />
          ) : (
            <div className="placeholder">{user.firstname[0]}</div>
          )}
        </div>
        <div className="public-info">
           <br/> 
          <p className="published-ads">
            <strong>{user.publishedAds}</strong> published ads
          </p>
          <p>
            <strong>Location:</strong> {user.location}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>WhatsApp:</strong> {user.whatsapp}
          </p>
        </div>
      </div>

      <div className="profile-right">
        <h1>
          {user.firstname} {user.lastname}
        </h1>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Purpose</label>
            <select
              value={filters.purpose}
              onChange={(e) =>
                setFilters((f) => ({ ...f, purpose: e.target.value }))
              }
            >
              <option value="All">All</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              value={filters.location}
              placeholder="Enter location"
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
            />
          </div>

          <div className="filter-group">
            <label>Property type</label>
            <select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, propertyType: e.target.value }))
              }
            >
              {propertyTypeOptions.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Beds</label>
            <div className="pill-group">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={
                    "pill" + (filters.beds === n ? " active" : "")
                  }
                  onClick={() =>
                    setFilters((f) => ({ ...f, beds: f.beds === n ? null : n }))
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Baths</label>
            <div className="pill-group">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={
                    "pill" + (filters.baths === n ? " active" : "")
                  }
                  onClick={() =>
                    setFilters((f) => ({ ...f, baths: f.baths === n ? null : n }))
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price (EGP)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, priceMin: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, priceMax: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="filter-actions">
            <button type="button" className="reset-btn" onClick={clearFilters}>
              Clear Filters
            </button>
            <button type="button" className="apply-btn">
              Apply
            </button>
          </div>
        </div>

        <div className="ads-list">
          {ads.length === 0 ? (
            <div className="no-ads">
              <img
                src="/mnt/data/7f283ca4-50ad-4368-bc66-71056179edf3.png"
                alt="No Ads"
              />
              <p>
                <strong>There are no ads</strong>
              </p>
              <p>When users post ads, they will appear here</p>
            </div>
          ) : (
            ads.map((ad, idx) => (
              <div key={idx} className="ad-item">
                {ad.title}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
