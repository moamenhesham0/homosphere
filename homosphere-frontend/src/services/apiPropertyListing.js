import { uploadImageToCloudflare, uploadMultipleImages } from './cloudflareUpload';
import { supabase } from '../utils/supabase';

/**
 * Get the authentication token from Supabase session
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Create a new property listing
 * @param {Object} listingData - Property listing form data
 * @param {File} bannerImageFile - Banner image file
 * @param {File[]} propertyImageFiles - Array of property image files
 * @returns {Promise<Object>} - The created property listing response
 */
export async function createPropertyListing(listingData, bannerImageFile, propertyImageFiles) {
  try {
    // Step 1: Upload banner image to Cloudflare
    const bannerImageUrl = await uploadImageToCloudflare(bannerImageFile);

    // Step 2: Upload property images to Cloudflare
    const propertyImageUrls = await uploadMultipleImages(propertyImageFiles);

    // Step 3: Construct the request payload
    const requestPayload = {
      title: listingData.title,
      description: listingData.description,
      price: parseFloat(listingData.price),
      sellerId: listingData.sellerId, // Should come from auth context
      bannerImage: {
        imageUrl: bannerImageUrl,
      },
      propertyImages: propertyImageUrls.map(url => ({
        imageUrl: url,
      })),
      property: {
        areaInSquareMeters: parseFloat(listingData.area),
        bedrooms: parseInt(listingData.bedrooms),
        bathrooms: parseInt(listingData.bathrooms),
        propertyType: listingData.propertyType,
        location: {
          latitude: listingData.location.latitude,
          longitude: listingData.location.longitude,
          address: listingData.location.address,
          city: listingData.location.city,
          state: listingData.location.state,
          country: listingData.location.country,
          postalCode: listingData.location.postalCode,
        },
        yearBuilt: listingData.yearBuilt ? parseInt(listingData.yearBuilt) : null,
        propertyCondition: listingData.propertyCondition || null,
        amenities: listingData.amenities || [],
      },
      propertyListingStatus: 'PENDING', // Default status
    };

    // Step 4: Get auth token and send the request to backend
    const token = await getAuthToken();
    const response = await fetch('http://localhost:8080/api/property-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to create property listing: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating property listing:', error);
    throw error;
  }
}

/**
 * Get all property listings
 * @returns {Promise<Array>} - Array of property listings
 */
export async function getAllPropertyListings() {
  const token = await getAuthToken();
  const response = await fetch('http://localhost:8080/api/property-listing', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property listings: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a single property listing by ID
 * @param {string} id - Property listing ID
 * @returns {Promise<Object>} - Property listing details
 */
export async function getPropertyListingById(id) {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:8080/api/property-listing/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property listing: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a property listing
 * @param {string} id - Property listing ID
 * @param {Object} listingData - Updated property listing data
 * @param {File} bannerImageFile - New banner image file (optional)
 * @param {File[]} propertyImageFiles - New property image files (optional)
 * @returns {Promise<Object>} - Updated property listing
 */
export async function updatePropertyListing(id, listingData, bannerImageFile = null, propertyImageFiles = []) {
  try {
    let bannerImageUrl = listingData.bannerImage?.imageUrl;
    let propertyImageUrls = listingData.propertyImages?.map(img => img.imageUrl) || [];

    // Upload new banner image if provided
    if (bannerImageFile) {
      bannerImageUrl = await uploadImageToCloudflare(bannerImageFile);
    }

    // Upload new property images if provided
    if (propertyImageFiles.length > 0) {
      const newImageUrls = await uploadMultipleImages(propertyImageFiles);
      propertyImageUrls = [...propertyImageUrls, ...newImageUrls];
    }

    const requestPayload = {
      ...listingData,
      bannerImage: {
        imageUrl: bannerImageUrl,
      },
      propertyImages: propertyImageUrls.map(url => ({
        imageUrl: url,
      })),
    };

    const token = await getAuthToken();
    const response = await fetch(`http://localhost:8080/api/property-listing/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to update property listing: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating property listing:', error);
    throw error;
  }
}

/**
 * Delete a property listing
 * @param {string} id - Property listing ID
 * @returns {Promise<void>}
 */
export async function deletePropertyListing(id) {
  const token = await getAuthToken();
  const response = await fetch(`http://localhost:8080/api/property-listing/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete property listing: ${response.statusText}`);
  }
}
