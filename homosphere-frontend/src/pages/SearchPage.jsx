import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchPage.css';


const API_BASE_URL = 'http://localhost:8080/api/properties';

// Utility function to format price from number to string (assuming USD/EGP formatting as required)
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Price N/A';
    // Format as a currency string. Adjust 'USD' to 'EGP' if your data is Egyptian Pounds
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
};


const SearchPage = () => {
    // State for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [propertyType, setPropertyType] = useState(''); // Not directly supported by current backend DTO/Controller
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [location, setLocation] = useState(''); // Used to send City/State
    const [age, setAge] = useState(''); // Add age state
    const [showFilters, setShowFilters] = useState(false);

    // State for data and loading
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based page index
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 8; // Should match the default size in the backend controller

    // State for favorites
    const [favorites, setFavorites] = useState([]);

    // State for property details view
    const [showDetails, setShowDetails] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigate = useNavigate();


    // CORE FUNCTION: Fetch and Filter Logic
    const fetchProperties = useCallback(async (page = 0) => {
        setLoading(true);
        setError(null);
        setCurrentPage(page);

        try {
            let url;
            const params = new URLSearchParams({ page: page.toString(), size: itemsPerPage.toString() });

            // --- 1. Determine Endpoint and Parameters ---
            const activeFilters = bedrooms || bathrooms || priceRange.min || priceRange.max || location || age;
            const isSimpleSearch = searchQuery.trim() !== '' && !activeFilters;

            if (isSimpleSearch) {
                // Simple text search (/search endpoint)
                url = `${API_BASE_URL}/search`;
                params.append('q', searchQuery.trim());
            } else {
                // Filtered search (/filter endpoint)
                url = `${API_BASE_URL}/filter`;

                // Price Range
                const minP = priceRange.min;
                const maxP = priceRange.max;
                if (minP && !isNaN(Number(minP))) params.append('minPrice', minP);
                if (maxP && !isNaN(Number(maxP))) params.append('maxPrice', maxP);

                // Bedrooms/Bathrooms
                if (bedrooms) params.append('bedrooms', bedrooms);
                if (bathrooms) params.append('bathrooms', bathrooms);

                // Age
                if (age && !isNaN(Number(age))) params.append('age', age);

                // Location (Assuming location input is "City, State")
                if (location) {
                    const parts = location.split(',').map(p => p.trim());
                    if (parts[0]) params.append('city', parts[0]);
                    if (parts[1]) params.append('state', parts[1]);
                }
            }

            // --- 2. Fetch Data ---
            const response = await fetch(`${url}?${params.toString()}`);

            // Check for non-200 status *before* trying to parse JSON (to catch HTML error pages)
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Call Failed:', response.status, errorText.substring(0, 100) + '...');
                throw new Error(`Server responded with status ${response.status}. Check backend logs.`);
            }

            const data = await response.json();
            console.log('Fetched properties from backend:', data);
            // --- 3. Map DTO to Frontend State (Handling missing mock data fields) ---
            const mappedProperties = (data.content || []).map(p => ({
                id: p.propertyListingId || p.id, // Use propertyListingId if present, fallback to id
                title: p.title,
                // Combine city and state for display
                location: `${p.city || ''}${p.city && p.state ? ', ' : ''}${p.state || ''}`,
                // Format the numeric price from DTO
                price: formatPrice(p.price),
                beds: p.bedrooms,
                baths: p.bathrooms,
                // --- Use imageUrl from bannerImage object if present ---
                image: (p.bannerImage && p.bannerImage.imageUrl) ? p.bannerImage.imageUrl : 'https://via.placeholder.com/400x300?text=Image+Missing',
                badge: p.badge || '',
                description: p.description || p.title,
                sqft: p.propertyAreaSqFt || 'N/A',
                type: p.type || 'House',
            }));

            setProperties(mappedProperties);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);

        } catch (e) {
            console.error('Failed to fetch properties:', e);
            setError(`Could not load properties. Error: ${e.message}`);
            setProperties([]);
            setTotalPages(1);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, priceRange, bedrooms, bathrooms, location, age]);

    // Trigger fetch on initial load and when filters/search change
    useEffect(() => {
        // Set page to 0 and trigger a new search/filter run
        fetchProperties(0);
    }, [fetchProperties]);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties(0); // Always restart search from page 0
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setPriceRange({ min: '', max: '' });
        setPropertyType('');
        setBedrooms('');
        setBathrooms('');
        setLocation('');
        setAge('');
        // fetchProperties(0) will be called by the useEffect hook after state changes
    };

    const handlePropertyClick = (property) => {
        navigate(`/property/${property.id}`);
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

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        // pageNumber is 1-based, convert to 0-based for the backend
        fetchProperties(pageNumber - 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            fetchProperties(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchProperties(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        // Render up to 5 page numbers around the current page
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage + 1 - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-number ${currentPage + 1 === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    }


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

                                {/* Location Filter (Used for City/State filter) */}
                                <div className="filter-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                {/* Property Type Filter (Requires DTO/Controller support) */}
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

                                {/* Bedrooms Filter */}
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

                                {/* Bathrooms Filter */}
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

                                {/* Age Filter */}
                                <div className="filter-group">
                                    <label>Age (years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Property Age"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                    />
                                </div>
                                {/* Removed Purpose Filter UI */}
                            </div>

                            {/* Price Range */}
                            <div className="price-range-row">
                                <div className="filter-group full-width">
                                    <label>Price Range (EGP/USD)</label>
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

                            {/* Filter Actions */}
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
                        <span className="results-count">{totalElements} properties found</span>
                    </div>

                    {loading && <div className="loading-spinner">Loading properties...</div>}

                    {error && <div className="error-message">{error}</div>}

                    {!loading && properties.length === 0 && !error && (
                        <div className="no-results">No properties found matching your criteria.</div>
                    )}

                    <div className="properties-container">
                        {properties.map(property => (
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
                                disabled={currentPage === 0}
                                className="pagination-btn"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                Previous
                            </button>

                            <div className="pagination-numbers">
                                {renderPageNumbers()}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages - 1}
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

                {/* Property Details Modal */}
                {showDetails && selectedProperty && (
                    <div className="modal-overlay property-details-page">
                        <div className="modal-content" style={{ maxWidth: '1000px', margin: '40px auto' }}>
                            <button className="modal-close" onClick={handleBackToSearch}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <div className="modal-body">
                                <div className="modal-image">
                                    <img src={selectedProperty.image} alt={selectedProperty.title} />
                                    {selectedProperty.badge && (
                                        <span className={`property-badge ${selectedProperty.badge.toLowerCase()}`}>{selectedProperty.badge}</span>
                                    )}
                                </div>
                                <div className="modal-details">
                                    <div className="modal-header">
                                        <h2>{selectedProperty.title || 'No Title'}</h2>
                                        <p className="modal-price">{selectedProperty.price ? formatPrice(selectedProperty.price) : 'No Price'}</p>
                                    </div>
                                    <div className="modal-location">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {selectedProperty.property?.location?.city || 'No City'}, {selectedProperty.property?.location?.state || 'No State'}
                                    </div>
                                    <div className="modal-features-grid">
                                        <div className="modal-feature-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                            <div>
                                                <span className="modal-feature-value">{selectedProperty.property?.bedrooms ?? 'N/A'}</span>
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
                                                <span className="modal-feature-value">{selectedProperty.property?.bathrooms ?? 'N/A'}</span>
                                                <span className="modal-feature-label">Bathrooms</span>
                                            </div>
                                        </div>
                                        <div className="modal-feature-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            </svg>
                                            <div>
                                                <span className="modal-feature-value">{selectedProperty.property?.propertyAreaSqFt ?? 'N/A'}</span>
                                                <span className="modal-feature-label">Area (sqft)</span>
                                            </div>
                                        </div>
                                        <div className="modal-feature-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            </svg>
                                            <div>
                                                <span className="modal-feature-value">{selectedProperty.property?.type || 'N/A'}</span>
                                                <span className="modal-feature-label">Property Type</span>
                                            </div>
                                        </div>
                                        <div className="modal-feature-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            </svg>
                                            <div>
                                                <span className="modal-feature-value">{selectedProperty.property?.condition || 'N/A'}</span>
                                                <span className="modal-feature-label">Condition</span>
                                            </div>
                                        </div>
                                        <div className="modal-feature-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            </svg>
                                            <div>
                                                <span className="modal-feature-value">{selectedProperty.property?.yearBuilt || 'N/A'}</span>
                                                <span className="modal-feature-label">Year Built</span>
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
        </div>
    );
};

export default SearchPage;