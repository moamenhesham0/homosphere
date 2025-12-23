import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RequestViewForm from '../components/RequestViewForm';
import '../styles/PropertyDetailsPage.css';

const API_BASE_URL = 'http://localhost:8080/api/properties';

const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Price N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
};

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showRequestForm, setShowRequestForm] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch property');
                const data = await response.json();
                console.log('Property data:', data);
                setProperty(data);
                setSelectedImageIndex(0); // Always start with first image
            } catch (e) {
                console.error('Fetch error:', e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) return (
        <div className="property-details-page">
            <div className="loading-spinner">Loading property...</div>
        </div>
    );

    if (error) return (
        <div className="property-details-page">
            <div className="error-message">{error}</div>
        </div>
    );

    if (!property) return (
        <div className="property-details-page">
            <div className="no-results">Property not found.</div>
        </div>
    );

    // Extract nested property data safely
    const propertyData = property.property || {};
    const location = propertyData.location || {};
    const bannerImage = property.bannerImage || {};
    const propertyImages = property.propertyImages || [];

    // Combine banner image with property images for the gallery
    const allImages = [];

    // Add banner image first if it exists
    if (bannerImage.imageUrl) {
        allImages.push({
            imageUrl: bannerImage.imageUrl,
            isBanner: true,
            alt: 'Banner Image'
        });
    }

    // Add all property images
    propertyImages.forEach((img, index) => {
        allImages.push({
            imageUrl: img.imageUrl,
            isBanner: false,
            alt: `Property Image ${index + 1}`
        });
    });

    // Get current selected image
    const currentImage = allImages[selectedImageIndex] || null;
    const hasImages = allImages.length > 0;

    const handleImageSelect = (index) => {
        setSelectedImageIndex(index);
    };

    const handleNextImage = () => {
        if (selectedImageIndex < allImages.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    return (
        <div className="property-details-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back to Search
            </button>

            <div className="property-details-body">
                {/* Property Image Section */}
                <div className="property-image-section">
                    {/* Main Image Display */}
                    <div className="main-image-container">
                        {hasImages ? (
                            <>
                                <img
                                    src={currentImage.imageUrl}
                                    alt={currentImage.alt}
                                    className="main-property-image"
                                />

                                {/* Image Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            className="image-nav-btn prev-btn"
                                            onClick={handlePrevImage}
                                            disabled={selectedImageIndex === 0}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>
                                        <button
                                            className="image-nav-btn next-btn"
                                            onClick={handleNextImage}
                                            disabled={selectedImageIndex === allImages.length - 1}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                {allImages.length > 1 && (
                                    <div className="image-counter">
                                        {selectedImageIndex + 1} / {allImages.length}
                                    </div>
                                )}

                                {/* Banner Badge on Main Image */}
                                {currentImage.isBanner && (
                                    <span className="main-image-badge">Banner</span>
                                )}
                            </>
                        ) : (
                            <div className="no-image-placeholder">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <p>No images available</p>
                            </div>
                        )}
                    </div>

                    {/* Image Gallery Thumbnails */}
                    {hasImages && allImages.length > 1 && (
                        <div className="image-gallery-container">
                            <div className="image-gallery-scroll">
                                {allImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`gallery-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                        onClick={() => handleImageSelect(index)}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={img.alt}
                                        />
                                        {img.isBanner && (
                                            <span className="thumbnail-badge">Banner</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Property Details Section */}
                <div className="property-details">
                    {/* Header with Title and Price */}
                    <div className="property-header">
                        <h2>{property.title || 'Untitled Property'}</h2>
                        <p className="property-price">{formatPrice(property.price)}</p>
                    </div>

                    {/* Seller Information */}
                    {property.sellerName && (
                        <div className="property-seller">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Listed by: <strong>{property.sellerName}</strong></span>
                        </div>
                    )}

                    {/* Location */}
                    <div className="property-location">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {location.city || 'Unknown City'}, {location.state || 'Unknown State'}
                    </div>

                    {/* Features Grid */}
                    <div className="property-features-grid">
                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {propertyData.bedrooms ?? 'N/A'}
                                </span>
                                <span className="property-feature-label">Bedrooms</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {propertyData.bathrooms ?? 'N/A'}
                                </span>
                                <span className="property-feature-label">Bathrooms</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {property?.property?.propertyAreaSqFt ?? 'N/A'}
                                </span>
                                <span className="property-feature-label">Property Area (sq ft)</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {property?.property?.lotAreaSqFt ?? 'N/A'}
                                </span>
                                <span className="property-feature-label">Lot Area (sq ft)</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {propertyData.type || 'N/A'}
                                </span>
                                <span className="property-feature-label">Property Type</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {propertyData.condition || 'N/A'}
                                </span>
                                <span className="property-feature-label">Condition</span>
                            </div>
                        </div>

                        <div className="property-feature-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            <div>
                                <span className="property-feature-value">
                                    {propertyData.yearBuilt || 'N/A'}
                                </span>
                                <span className="property-feature-label">Year Built</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="property-description">
                        <h3>Description</h3>
                        <p>{property.description || 'No description available.'}</p>
                    </div>

                    {/* Property Attributes Table */}
                    <div className="property-attributes">
                        <h3>Property Details</h3>
                        <table className="property-attributes-table">
                            <tbody>
                                <tr>
                                    <td>Address</td>
                                    <td>
                                        {location.street && `${location.street}, `}
                                        {location.city && `${location.city}, `}
                                        {location.state && `${location.state} `}
                                        {location.zipCode || ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{formatPrice(property.price)}</td>
                                </tr>
                                <tr>
                                    <td>Property Type</td>
                                    <td>{propertyData.type || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Bedrooms</td>
                                    <td>{propertyData.bedrooms ?? 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Bathrooms</td>
                                    <td>{propertyData.bathrooms ?? 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Property Area</td>
                                    <td>{property?.property?.propertyAreaSqFt ? `${property.property.propertyAreaSqFt} sq ft` : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Lot Area</td>
                                    <td>{property?.property?.lotAreaSqFt ? `${property.property.lotAreaSqFt} sq ft` : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Condition</td>
                                    <td>{propertyData.condition || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Year Built</td>
                                    <td>{propertyData.yearBuilt || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Views</td>
                                    <td>{property.views ?? 0}</td>
                                </tr>
                                {property.sellerName && (
                                    <tr>
                                        <td>Seller</td>
                                        <td>{property.sellerName}</td>
                                    </tr>
                                )}
                                {property.brookerName && (
                                    <tr>
                                        <td>Broker</td>
                                        <td>{property.brookerName}</td>
                                    </tr>
                                )}
                                {property.publicationDate && (
                                    <tr>
                                        <td>Published</td>
                                        <td>{new Date(property.publicationDate).toLocaleDateString()}</td>
                                    </tr>
                                )}
                                {property.lastUpdatedDate && (
                                    <tr>
                                        <td>Last Updated</td>
                                        <td>{new Date(property.lastUpdatedDate).toLocaleDateString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="property-actions">
                        <button className="property-btn property-btn-primary" onClick={() => setShowRequestForm(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                            </svg>
                            Request Viewing
                        </button>
                        <button className="property-btn property-btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Save Property
                        </button>
                        <button className="property-btn property-btn-secondary">
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

            {/* Viewing Request Form Modal */}
            {showRequestForm && (
                <div className="modal-overlay" onClick={() => setShowRequestForm(false)}>
                    <RequestViewForm
                        propertyId={id}
                        onClose={() => setShowRequestForm(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default PropertyDetailsPage;