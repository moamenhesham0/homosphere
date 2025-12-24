// src/services/propertyApi.js

export async function fetchPublishedPropertiesByUser(userId) {
  const response = await fetch(
    `http://localhost:8080/api/property-listing/public/user/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
