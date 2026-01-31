// src/services/propertyApi.js

export async function fetchPublishedPropertiesByUser(userId, token, isAdmin) {
  const headers = { "Content-Type": "application/json" };
  // Only send Authorization if user is admin
  if (token && isAdmin) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(
    `http://localhost:8080/api/property-listing/public/user/${userId}`,
    {
      method: "GET",
      headers,
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
