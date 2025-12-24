import React from "react";
import "../styles/SearchPage.css";

export default function PublicPropertyCard({ property, onClick }) {
  return (
    <div className="property-card" onClick={onClick} style={{ cursor: "pointer" }}>
      {property.badge && (
        <span className={`property-badge ${property.badge.toLowerCase()}`}>{property.badge}</span>
      )}
      <div className="property-image">
        <img src={property.bannerImage?.imageUrl || property.image || ""} alt={property.title} />
      </div>
      <div className="property-content">
        <div className="property-price">{property.price}</div>
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">{property.city || property.location}</p>
        <p className="property-description">{property.description}</p>
        <div className="property-features">
          {property.bedrooms > 0 && <span className="feature">{property.bedrooms} beds</span>}
          {property.bathrooms > 0 && <span className="feature">{property.bathrooms} baths</span>}
          {property.area > 0 && <span className="feature">{property.area} sqft</span>}
        </div>
      </div>
    </div>
  );
}
