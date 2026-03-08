import { supabase } from '../utils/supabase';

/**
 * Get the authentication token from Supabase session
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Upload an image to Cloudflare R2 via backend
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadImageToCloudflare(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = await getAuthToken();
  const response = await fetch('http://localhost:8080/api/media/upload', {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.log(errorData);
    throw new Error(errorData?.message || `Upload failed: ${response.message}`);
  }

  const data = await response.json();
  return data.url; // Assuming backend returns { url: "..." }
}

/**
 * Upload multiple images to Cloudflare R2
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export async function uploadMultipleImages(files) {
  const uploadPromises = files.map(file => uploadImageToCloudflare(file));
  return Promise.all(uploadPromises);
}
