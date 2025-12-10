import React, { useState } from 'react';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 8;

  // Mock data for demonstration
  const mockProperties = [
    {
      id: 1,
      price: '$1,250,000',
      title: 'Modern Luxury Villa',
      location: 'Beverly Hills, CA',
      beds: 4,
      baths: 3,
      sqft: '3,200',
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      badge: 'New',
      description: 'Stunning modern villa with panoramic city views'
    },
    {
      id: 2,
      price: '$890,000',
      title: 'Downtown Penthouse',
      location: 'Manhattan, NY',
      beds: 3,
      baths: 2,
      sqft: '2,400',
      type: 'Penthouse',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      badge: 'Hot',
      description: 'Luxurious penthouse in the heart of the city'
    },
    {
      id: 3,
      price: '$2,100,000',
      title: 'Beachfront Estate',
      location: 'Malibu, CA',
      beds: 5,
      baths: 4,
      sqft: '4,800',
      type: 'Estate',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      badge: 'Sale',
      description: 'Exclusive beachfront property with private beach access'
    },
    {
      id: 4,
      price: '$650,000',
      title: 'Urban Loft',
      location: 'Brooklyn, NY',
      beds: 2,
      baths: 2,
      sqft: '1,800',
      type: 'Loft',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      badge: '',
      description: 'Modern loft with industrial design elements'
    },
    {
      id: 5,
      price: '$1,800,000',
      title: 'Garden Mansion',
      location: 'Westchester, NY',
      beds: 6,
      baths: 5,
      sqft: '5,200',
      type: 'Mansion',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      badge: 'Premium',
      description: 'Elegant mansion with beautiful landscaped gardens'
    },
    {
      id: 6,
      price: '$750,000',
      title: 'Cozy Townhouse',
      location: 'Queens, NY',
      beds: 3,
      baths: 2,
      sqft: '2,000',
      type: 'Townhouse',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      badge: '',
      description: 'Charming townhouse in a quiet neighborhood'
    },
    {
      id: 7,
      price: '$950,000',
      title: 'Waterfront Apartment',
      location: 'Seattle, WA',
      beds: 3,
      baths: 2,
      sqft: '2,100',
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      badge: 'New',
      description: 'Beautiful apartment with stunning water views'
    },
    {
      id: 8,
      price: '$1,450,000',
      title: 'Mountain Villa',
      location: 'Aspen, CO',
      beds: 5,
      baths: 4,
      sqft: '4,200',
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
      badge: 'Hot',
      description: 'Luxurious mountain retreat with ski access'
    },
    {
      id: 9,
      price: '$720,000',
      title: 'Contemporary Condo',
      location: 'Austin, TX',
      beds: 2,
      baths: 2,
      sqft: '1,600',
      type: 'Condo',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      badge: '',
      description: 'Modern condo in vibrant downtown area'
    },
    {
      id: 10,
      price: '$3,200,000',
      title: 'Luxury Estate',
      location: 'Miami Beach, FL',
      beds: 7,
      baths: 6,
      sqft: '6,500',
      type: 'Estate',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      badge: 'Premium',
      description: 'Spectacular oceanfront estate with private dock'
    },
    {
      id: 11,
      price: '$580,000',
      title: 'Suburban Family Home',
      location: 'Portland, OR',
      beds: 4,
      baths: 3,
      sqft: '2,800',
      type: 'House',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      badge: '',
      description: 'Spacious family home in great neighborhood'
    },
    {
      id: 12,
      price: '$1,100,000',
      title: 'Historic Brownstone',
      location: 'Boston, MA',
      beds: 4,
      baths: 3,
      sqft: '3,000',
      type: 'Townhouse',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      badge: 'Sale',
      description: 'Beautifully restored historic brownstone'
    },
    {
      id: 13,
      price: '$825,000',
      title: 'Desert Oasis',
      location: 'Scottsdale, AZ',
      beds: 3,
      baths: 3,
      sqft: '2,500',
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      badge: 'New',
      description: 'Stunning desert home with pool and spa'
    },
    {
      id: 14,
      price: '$1,650,000',
      title: 'Lakefront Property',
      location: 'Lake Tahoe, CA',
      beds: 5,
      baths: 4,
      sqft: '4,000',
      type: 'House',
      image: 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=800&q=80',
      badge: 'Hot',
      description: 'Beautiful lakefront home with private beach'
    },
    {
      id: 15,
      price: '$690,000',
      title: 'City Center Apartment',
      location: 'Chicago, IL',
      beds: 2,
      baths: 2,
      sqft: '1,500',
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
      badge: '',
      description: 'Stylish apartment in prime city location'
    },
    {
      id: 16,
      price: '$2,800,000',
      title: 'Vineyard Estate',
      location: 'Napa Valley, CA',
      beds: 6,
      baths: 5,
      sqft: '5,800',
      type: 'Estate',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      badge: 'Premium',
      description: 'Exquisite estate with private vineyard'
    },
    {
      id: 17,
      price: '$920,000',
      title: 'Golf Course Home',
      location: 'Phoenix, AZ',
      beds: 4,
      baths: 3,
      sqft: '3,100',
      type: 'House',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      badge: '',
      description: 'Elegant home on prestigious golf course'
    },
    {
      id: 18,
      price: '$1,380,000',
      title: 'Coastal Retreat',
      location: 'San Diego, CA',
      beds: 4,
      baths: 4,
      sqft: '3,600',
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
      badge: 'Sale',
      description: 'Gorgeous coastal home with ocean views'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement API call when backend is ready
    console.log('Search filters:', {
      searchQuery,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      location,
      sortBy
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setPropertyType('');
    setBedrooms('');
    setBathrooms('');
    setLocation('');
    setSortBy('newest');
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleFavorite = (propertyId) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(mockProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = mockProperties.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header-content">
          <div className="search-bar-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for properties, locations, or neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="button" onClick={handleSearch} className="search-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="search-filters">
            <form onSubmit={handleSearch} className="search-form">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Purpose</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">All</option>
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Property Type</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="">All</option>
                    <option value="Apartments for Sale">Apartments for Sale</option>
                    <option value="Villas For Sale">Villas For Sale</option>
                    <option value="Vacation Homes for Sale">Vacation Homes for Sale</option>
                    <option value="Commercial for Sale">Commercial for Sale</option>
                    <option value="Buildings & Lands">Buildings & Lands</option>
                    <option value="Apartments for Rent">Apartments for Rent</option>
                    <option value="Villas for Rent">Villas for Rent</option>
                    <option value="Vacation Homes for Rent">Vacation Homes for Rent</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Bedrooms</label>
                  <div className="pill-group">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`pill ${bedrooms === n.toString() ? 'active' : ''}`}
                        onClick={() => setBedrooms(bedrooms === n.toString() ? '' : n.toString())}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Bathrooms</label>
                  <div className="pill-group">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`pill ${bathrooms === n.toString() ? 'active' : ''}`}
                        onClick={() => setBathrooms(bathrooms === n.toString() ? '' : n.toString())}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              <div className="price-range-row">
                <div className="filter-group full-width">
                  <label>Price Range (EGP)</label>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-actions">
                <button type="button" onClick={handleClearFilters} className="reset-btn">
                  Clear Filters
                </button>
                <button type="submit" className="apply-btn">
                  Apply
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Results */}
        <div className="search-results">
          <div className="results-header">
            <h2>Your next property is here.</h2>
            <p>Let's find a home that's perfect for you</p>
            <span className="results-count">{mockProperties.length} properties found</span>
          </div>

          <div className="properties-container">
            {currentProperties.map(property => (
              <div key={property.id} className="property-card" onClick={() => handlePropertyClick(property)}>
                {property.badge && <span className={`property-badge ${property.badge.toLowerCase()}`}>{property.badge}</span>}
                
                <div className="property-image">
                  <img src={property.image} alt={property.title} />
                  <button 
                    className={`favorite-btn ${favorites.includes(property.id) ? 'favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(property.id);
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill={favorites.includes(property.id) ? "#fff" : "none"} stroke={favorites.includes(property.id) ? "#fff" : "#fff"} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>

                <div className="property-content">
                  <div className="property-price">{property.price}</div>
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  <p className="property-description">{property.description}</p>
                  
                  <div className="property-features">
                    <span className="feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      {property.beds} beds
                    </span>
                    <span className="feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {property.baths} baths
                    </span>
                    <span className="feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      </svg>
                      {property.sqft} sqft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProperty.image} alt={selectedProperty.title} />
                {selectedProperty.badge && (
                  <span className={`property-badge ${selectedProperty.badge.toLowerCase()}`}>
                    {selectedProperty.badge}
                  </span>
                )}
              </div>
              
              <div className="modal-details">
                <div className="modal-header">
                  <h2>{selectedProperty.title}</h2>
                  <p className="modal-price">{selectedProperty.price}</p>
                </div>
                
                <div className="modal-location">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {selectedProperty.location}
                </div>
                
                <div className="modal-features-grid">
                  <div className="modal-feature-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <div>
                      <span className="modal-feature-value">{selectedProperty.beds}</span>
                      <span className="modal-feature-label">Bedrooms</span>
                    </div>
                  </div>
                  
                  <div className="modal-feature-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <div>
                      <span className="modal-feature-value">{selectedProperty.baths}</span>
                      <span className="modal-feature-label">Bathrooms</span>
                    </div>
                  </div>
                  
                  <div className="modal-feature-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                    <div>
                      <span className="modal-feature-value">{selectedProperty.sqft}</span>
                      <span className="modal-feature-label">Square Feet</span>
                    </div>
                  </div>
                  
                  <div className="modal-feature-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                    <div>
                      <span className="modal-feature-value">{selectedProperty.type}</span>
                      <span className="modal-feature-label">Property Type</span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-description">
                  <h3>Description</h3>
                  <p>{selectedProperty.description}</p>
                </div>
                
                <div className="modal-actions">
                  <button className="modal-btn modal-btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Contact Agent
                  </button>
                  <button className="modal-btn modal-btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Save Property
                  </button>
                  <button className="modal-btn modal-btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
