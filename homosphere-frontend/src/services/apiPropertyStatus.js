// Service for updating property status
export async function updatePropertyStatus(propertyListingId, status, token) {
  const response = await fetch('http://localhost:8080/api/properties/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ propertyListingId, status }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update property status');
  }
  return response;
}
