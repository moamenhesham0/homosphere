import { getAuthHeaders } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:8080/api';
const PROPERTY_SUBMISSION_REVIEW_BASE_API_URL = `${API_BASE_URL}/property-submission-review`;

export async function getPropertySubmissionReview(propertyListingId) {
  const response = await fetch(`${PROPERTY_SUBMISSION_REVIEW_BASE_API_URL}/${propertyListingId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property submission review: ${response.statusText}`);
  }

  return response.json();
}
