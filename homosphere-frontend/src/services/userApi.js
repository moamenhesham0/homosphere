// src/services/userApi.js

export async function fetchUserData(id) {
  const response = await fetch(
    `http://localhost:8080/api/public/retrieveInf/${id}`,
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
  const data = await response.json();
  // Map API response to user state
  return {
    firstname: data.firstName || "",
    lastname: data.lastName || "",
    username: data.userName || (data.email ? data.email.split("@")[0] : ""),
    role: data.role || "",
    email: data.email || "",
    whatsapp: data.phone || "",
    telegram: "",
    location: data.location || "",
    bio: data.bio || "",
    photo: data.photo || "",
    publishedAds: 0 // Optionally override in PublicProfile
  };
}

export async function fetchPublicUserData(id, token, isAdmin) {
  const headers = { "Content-Type": "application/json" };
  // Only send Authorization if user is admin
  if (token && isAdmin) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(
    `http://localhost:8080/api/public/retrieveInf/${id}`,
    {
      method: "GET",
      headers,
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Map API response to user state
  return {
    firstname: data.firstName || "",
    lastname: data.lastName || "",
    username: data.userName || (data.email ? data.email.split("@")[0] : ""),
    location: data.location || "",
    bio: data.bio || "",
    photo: data.photo || "",
    whatsapp: data.phone || "",
    telegram: data.telegram || "",
    publishedAds: 0 // Optionally override in PublicProfile
  };
}

export async function fetchPrivateUserData(id, token) {
  const response = await fetch(
    `http://localhost:8080/api/user/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    firstname: data.firstName || "",
    lastname: data.lastName || "",
    username: data.userName || (data.email ? data.email.split("@")[[0]] : ""),
    location: data.location || "",
    bio: data.bio || "",
    photo: data.photo || "",
    whatsapp: data.phone || "",
    email: data.email || "",
    role: data.role || "",
    status: data.status || "",
  };
}
