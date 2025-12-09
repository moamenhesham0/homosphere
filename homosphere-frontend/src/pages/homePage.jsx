import React, { useState } from 'react';
import '../styles/homePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const properties = [
    {
      id: 1,
      price: '$1,250,000',
      title: 'Modern Luxury Villa',
      location: 'Beverly Hills, CA',
      beds: 4,
      baths: 3,
      sqft: '3,200',
      badge: 'New'
    },
    {
      id: 2,
      price: '$890,000',
      title: 'Downtown Penthouse',
      location: 'Manhattan, NY',
      beds: 3,
      baths: 2,
      sqft: '2,400',
      badge: 'Hot'
    },
    {
      id: 3,
      price: '$2,100,000',
      title: 'Beachfront Estate',
      location: 'Malibu, CA',
      beds: 5,
      baths: 4,
      sqft: '4,800',
      badge: 'Sale'
    }
  ];

  const features = [
    {
      title: 'Premium Selection',
      description: 'Curated collection of luxury properties in prime locations across the city',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      title: 'Expert Guidance',
      description: 'Professional real estate agents with years of experience to guide you',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      title: 'Secure Process',
      description: 'Safe and transparent transactions with complete legal documentation',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="real-estate-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="pulse-circle"></div>
          <div className="blur-circle blur-circle-1"></div>
          <div className="blur-circle blur-circle-2"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="hero-title-accent">Dream Home</span>
          </h1>
          <p className="hero-description">
            Discover the finest properties in the most sought-after locations. Your perfect home awaits.
          </p>
          <a href="#properties" className="cta-button">
            Explore Properties
          </a>

          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, property type..."
              className="search-input"
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="properties-section">
        <h2 className="section-title">Featured Properties</h2>
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <div className="property-badge">{property.badge}</div>
              </div>
              <div className="property-info">
                <div className="property-price">{property.price}</div>
                <div className="property-title">{property.title}</div>
                <div className="property-location">{property.location}</div>
                <div className="property-specs">
                  <span className="property-spec">
                    <span className="spec-dot"></span>
                    {property.beds} Beds
                  </span>
                  <span className="property-spec">
                    <span className="spec-dot"></span>
                    {property.baths} Baths
                  </span>
                  <span className="property-spec">
                    <span className="spec-dot"></span>
                    {property.sqft} sqft
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">&copy; 2025 HomoSphere. All rights reserved.</p>
        <p className="footer-subtitle">Find your dream property with us</p>
        <div className="social-links">
          <a href="#" className="social-link">f</a>
          <a href="#" className="social-link">in</a>
          <a href="#" className="social-link">tw</a>
          <a href="#" className="social-link">li</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;