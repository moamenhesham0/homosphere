// src/services/apiSinglePropertyReviews.js

export async function fetchSinglePropertyReviews(propertyListingId, token) {
  const response = await fetch(`http://localhost:8080/api/property-submission-review/${propertyListingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch property reviews');
  return await response.json();
}
