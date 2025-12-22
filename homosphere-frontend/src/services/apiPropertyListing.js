import { getAuthHeaders } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:8080/api';
const PROPERTY_LISTING_BASE_API_URL = `${API_BASE_URL}/property-listing`;

const PROPERTY_BASE_API_URL = `${API_BASE_URL}/properties`;

// Fallback property types in case API fails
const FALLBACK_PROPERTY_TYPES = ['APARTMENT', 'VILLA', 'AYA'];


/**
 * Get all property types
 */
export async function fetchPropertyTypes() {
  try {
    const url = `${PROPERTY_BASE_API_URL}/all-types`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to fetch property types');
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error(' Error fetching property types:', error);
  }
}

/**
 * Get user property listing tabs/statuses
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of property listing statuses for the user
 */
export async function getUserPropertyListingTabs(userId) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/status/${userId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property tabs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit a new property listing for review
 * @param {Object} listingData - Property listing form data
 * @returns {Promise<Object>} - The created property listing response
 */
export async function submitPropertyListing(listingData) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/sumbit`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to submit property listing: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save a property listing as draft
 * @param {Object} listingData - Property listing form data
 * @returns {Promise<Object>} - The created draft property listing response
 */
export async function saveDraftPropertyListing(listingData) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/draft`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to save draft: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a draft property listing
 * @param {Object} draftRequest - Draft update request with id and data
 * @returns {Promise<Object>} - Updated draft property listing
 */
export async function updateDraftPropertyListing(draftRequest) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/update-draft`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(draftRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update draft: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Edit a published property listing
 * @param {Object} editRequest - Edit request with id and data
 * @returns {Promise<Object>} - Updated property listing
 */
export async function editPropertyListing(editRequest) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/edit`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(editRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to edit property listing: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a property listing by ID (authenticated)
 * @param {string} id - Property listing ID
 * @returns {Promise<Object>} - Property listing details
 */
export async function getPropertyListingById(id) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/${id}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property listing: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a property listing
 * @param {string} id - Property listing ID
 * @returns {Promise<void>}
 */
export async function deletePropertyListing(id) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete property listing: ${response.statusText}`);
  }
}

/**
 * Get all property listings (from store)
 * @returns {Promise<Array>} - Array of published property listings
 */
export async function getAllPropertyListings() {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/store`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property listings: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all user property listings (including drafts)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of all property listings for the user
 */
export async function getUserPropertyListings(userId) {
  const response = await fetch(`${PROPERTY_LISTING_BASE_API_URL}/user/${userId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user property listings: ${response.statusText}`);
  }

  return response.json();
}