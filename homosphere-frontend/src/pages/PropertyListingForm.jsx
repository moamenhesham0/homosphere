import { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { uploadImageToCloudflare, uploadMultipleImages } from '../services/cloudflareUpload';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GeoMap from '../components/GeoMap';
import '../styles/PropertyListingForm.css';
import {
  submitPropertyListing,
  getPropertyListingById,
  editPropertyListing,
  updateDraftPropertyListing,
  fetchPropertyTypes
} from '../services/apiPropertyListing';
import { AuthContext } from '../contexts/AuthContext';
import { getAmenityIcon } from '../utils/amenityIcons';
import { groupAmenitiesByType } from '../utils/amenityUtils';


const PropertyListingForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingListingData, setEditingListingData] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyAreaInSquareFeet: '',
    lotAreaInSquareFeet: '',
    bedrooms: '',
    bathrooms: '',
    type: '',
    seekingBroker : false,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: null,
    longitude: null,
    amenities: [],
  });

  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyImagePreviews, setPropertyImagePreviews] = useState([]);
  const [locationFromMap, setLocationFromMap] = useState(false);
  const [geocodeFunction, setGeocodeFunction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typesError, setTypesError] = useState(null);


  // Fetch property types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoadingTypes(true);
        setTypesError(null);
        const types = await fetchPropertyTypes();
        console.log('Fetched property types:', types);
        if (Array.isArray(types)) {
          setPropertyTypes(types);
        } else {
          setPropertyTypes([]);
          setTypesError('Invalid property types format');
        }
      } catch (error) {
        console.error('Error fetching property types:', error);
        setTypesError(error.message);
        setPropertyTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Load existing listing data if editing
  useEffect(() => {
    const loadListingData = async () => {
      if (editingId) {
        try {
          setIsSubmitting(true);
          const listingData = await getPropertyListingById(editingId);
          setEditingListingData(listingData);
          setIsEditMode(true);

          // Populate form with existing data
          setFormData({
            title: listingData.title || '',
            description: listingData.description || '',
            price: listingData.price || '',
            propertyAreaInSquareFeet: listingData.propertyAreaInSquareFeet || '',
            lotAreaInSquareFeet: listingData.lotAreaInSquareFeet || '',
            bedrooms: listingData.property?.bedrooms || '',
            bathrooms: listingData.property?.bathrooms || '',
            type: listingData.property?.propertyType || '',
            seekingBroker: listingData.seekingBroker || false,
            street: listingData.property?.location?.address || '',
            city: listingData.property?.location?.city || '',
            state: listingData.property?.location?.state || '',
            zipCode: listingData.property?.location?.postalCode || '',
            country: listingData.property?.location?.country || '',
            latitude: listingData.property?.location?.latitude || null,
            longitude: listingData.property?.location?.longitude || null,
            amenities: listingData.property?.amenities || [],
          });

          // Set image previews
          if (listingData.bannerImage?.imageUrl) {
            setBannerImagePreview(listingData.bannerImage.imageUrl);
          }
          if (listingData.propertyImages?.length > 0) {
            setPropertyImagePreviews(listingData.propertyImages.map(img => img.imageUrl));
          }

          if (listingData.property?.location?.latitude) {
            setLocationFromMap(true);
          }
        } catch (error) {
          console.error('Error loading listing data:', error);
          setSubmitError('Failed to load listing data');
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    loadListingData();
  }, [editingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true',
    }));
  };

  const handleLocationSelect = (locationData) => {
    if (locationData) {
      setFormData((prev) => ({
        ...prev,
        street: locationData.street || '',
        city: locationData.city || '',
        state: locationData.state || '',
        zipCode: locationData.zipCode || '',
        country: locationData.country || '',
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        amenities: locationData.amenities || [],
      }));
      setLocationFromMap(true);
    } else {
      // Clear location - allow manual input
      setFormData((prev) => ({
        ...prev,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        latitude: null,
        longitude: null,
        amenities: [],
      }));
      setLocationFromMap(false);
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      // Show local preview for UI, but do not use for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePropertyImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPropertyImages((prev) => [...prev, ...files]);
      // Show local previews for UI, but do not use for submission
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPropertyImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePropertyImage = (index) => {
    setPropertyImages((prev) => prev.filter((_, i) => i !== index));
    setPropertyImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeocodeManualAddress = async () => {
    if (!geocodeFunction) return;

    const addressString = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`.trim();
    if (!addressString || addressString === ',') {
      alert('Please enter at least some address information');
      return;
    }

    const success = await geocodeFunction(addressString);
    if (success) {
      setLocationFromMap(true);
    } else {
      alert('Could not find location. Please try a different address or select from the map.');
    }
  };

  // Memoize grouped amenities
  const groupedAmenities = useMemo(() => {
    return groupAmenitiesByType(formData.amenities);
  }, [formData.amenities]);

  const handleGeocodeRequest = useCallback((geocodeFn) => {
    setGeocodeFunction(() => geocodeFn);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!isEditMode && !bannerImage) {
      setSubmitError('Please upload a banner image');
      return;
    }
    if (!isEditMode && propertyImages.length === 0) {
      setSubmitError('Please upload at least one property image');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setSubmitError('Please select a location on the map');
      return;
    }
    if (!user?.id) {
      setSubmitError('You must be logged in to create a property listing');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Upload images to Cloudflare and get URLs
      let bannerImageUrl = bannerImagePreview;
      let propertyImageUrls = propertyImagePreviews;

      if (bannerImage && typeof bannerImage !== 'string') {
        bannerImageUrl = await uploadImageToCloudflare(bannerImage);
      }
      if (propertyImages.length > 0 && typeof propertyImages[0] !== 'string') {
        propertyImageUrls = await uploadMultipleImages(propertyImages);
      }

      // Prepare listing data for API (match backend DTO)
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        sellerId: user.id,
        bannerImage: bannerImageUrl ? { imageUrl: bannerImageUrl } : null,
        propertyImages: propertyImageUrls.map(img => ({ imageUrl: img })),
        property: {
          propertyAreaSqFt: parseFloat(formData.propertyAreaInSquareFeet),
          lotAreaSqFt: parseFloat(formData.lotAreaInSquareFeet),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          type: formData.type,
          amenities: formData.amenities,
          location: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        },
        managementStatus: null, // Set if needed
      };

      let response;
      if (isEditMode && editingId) {
        const status = editingListingData?.status;
        if (status === 'DRAFT' || status === 'REQUIRES_CHANGES') {
          response = await updateDraftPropertyListing(
            editingId,
            listingData,
            bannerImage,
            propertyImages
          );
        } else if (status === 'PUBLISHED') {
          response = await editPropertyListing(
            editingId,
            listingData,
            bannerImage,
            propertyImages
          );
        }
        alert('Property listing updated successfully!');
      } else {
        response = await submitPropertyListing(
          listingData,
          bannerImage,
          propertyImages
        );
        alert('Property listing created successfully!');
      }

      navigate('/profile');
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit property listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="property-listing-form-container">
      <form onSubmit={handleSubmit} className="property-listing-form">
        <h1>{isEditMode ? 'Edit Property Listing' : 'Create Property Listing'}</h1>

        {submitError && (
          <div className="error-message" style={{
            padding: '12px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
            marginBottom: '20px'
          }}>
            {submitError}
          </div>
        )}

        {/* Basic Information */}
        <section className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Property Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Modern 3BR Apartment in Downtown"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Describe the property..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Property Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loadingTypes}
              >
                <option value="">
                  {loadingTypes ? 'Loading types...' : typesError ? 'Error loading types' : 'Select a property type'}
                </option>
                {propertyTypes && propertyTypes.length > 0 ? (
                  propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                ) : (
                  !loadingTypes && !typesError && (
                    <option disabled>No property types available</option>
                  )
                )}
              </select>
              {typesError && <span className="error-text">{typesError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyAreaInSquareFeet">Property Area (sq ft) *</label>
              <input
                type="number"
                id="propertyAreaInSquareFeet"
                name="propertyAreaInSquareFeet"
                value={formData.propertyAreaInSquareFeet}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lotAreaInSquareFeet">Lot Area (sq ft) *</label>
              <input
                type="number"
                id="lotAreaInSquareFeet"
                name="lotAreaInSquareFeet"
                value={formData.lotAreaInSquareFeet}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms *</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms *</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Seeking Broker *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="seekingBroker"
                  value="true"
                  checked={formData.seekingBroker === true}
                  onChange={handleRadioChange}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="seekingBroker"
                  value="false"
                  checked={formData.seekingBroker === false}
                  onChange={handleRadioChange}
                  required
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="form-section">
          <h2>Location</h2>
          <p className="section-note">Click on the map to select the property location, or enter address manually and click "Find on Map"</p>

          <div className="map-container">
            <GeoMap
              onLocationSelect={handleLocationSelect}
              onGeocodeRequest={handleGeocodeRequest}
            />
          </div>

          <div className="location-details">
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                readOnly={locationFromMap}
                placeholder={locationFromMap ? "Filled from map" : "Enter street address"}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  readOnly={locationFromMap}
                  placeholder={locationFromMap ? "Filled from map" : "Enter city"}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  readOnly={locationFromMap}
                  placeholder={locationFromMap ? "Filled from map" : "Enter state"}
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  readOnly={locationFromMap}
                  placeholder={locationFromMap ? "Filled from map" : "Enter zip code"}
                />
              </div>
            </div>

            {!locationFromMap && (
              <button
                type="button"
                onClick={handleGeocodeManualAddress}
                className="geocode-button"
              >
                Find on Map
              </button>
            )}

            {formData.amenities.length > 0 && (
              <div className="amenities-list">
                <h3>Nearby Places ({formData.amenities.length})</h3>
                {Object.entries(groupedAmenities).map(([type, amenities]) => (
                  <div key={type} className="amenity-group">
                    <div className="amenity-group-header">
                      {getAmenityIcon(type)}
                      <h4>{type.charAt(0).toUpperCase() + type.slice(1)} ({amenities.length})</h4>
                    </div>
                    <div className="amenities-grid">
                      {amenities.map((amenity, index) => (
                        <div key={index} className="amenity-chip">
                          <span className="amenity-name">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Images */}
        <section className="form-section">
          <h2>Images</h2>

          {/* Banner Image */}
          <div className="form-group">
            <label htmlFor="bannerImage">Banner Image *</label>
            <p className="section-note">Main property image (recommended: 1920x1080px)</p>

            {!bannerImagePreview ? (
              <label htmlFor="bannerImage" className="upload-area banner-upload">
                <div className="upload-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00a676" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="upload-text">Click to upload banner image</p>
                  <p className="upload-hint">or drag and drop</p>
                  <p className="upload-formats">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  id="bannerImage"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  required={!bannerImage}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className="image-preview-container banner-container">
                <img
                  src={bannerImagePreview}
                  alt="Banner preview"
                  className="banner-preview"
                />
                <button
                  type="button"
                  className="change-image-btn"
                  onClick={() => {
                    setBannerImage(null);
                    setBannerImagePreview(null);
                  }}
                >
                  Change Image
                </button>
              </div>
            )}
          </div>

          {/* Property Images */}
          <div className="form-group">
            <label htmlFor="propertyImages">Property Images</label>
            <p className="section-note">Add multiple images to showcase your property</p>

            <label htmlFor="propertyImages" className="upload-area multi-upload">
              <div className="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a676" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="upload-text">Click to add more images</p>
                <p className="upload-hint">or drag and drop</p>
              </div>
              <input
                type="file"
                id="propertyImages"
                accept="image/*"
                multiple
                onChange={handlePropertyImagesChange}
                style={{ display: 'none' }}
              />
            </label>

            {propertyImagePreviews.length > 0 && (
              <div className="images-grid">
                {propertyImagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Property ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removePropertyImage(index)}
                      title="Remove image"
                    >
                      ×
                    </button>
                    <div className="image-number">{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="form-buttons">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Property Listing' : 'Submit Property Listing')}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/profile')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyListingForm;