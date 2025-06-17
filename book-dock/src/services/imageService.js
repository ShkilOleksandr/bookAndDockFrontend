// src/services/imageService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * Fetch all image metadata (including id, createdAt, creatorId) from the server.
 */
export const getImages = async () => {
  const res = await fetch(`${BASE_URL}/api/Image/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching images:', res.status, errorText);
    throw new Error(errorText || 'Failed to fetch images');
  }

  return res.json(); // returns array of image info objects
};

/**
 * Build the URL for downloading/previewing an image by its id.
 */
export const getImageUrl = (id) => `${BASE_URL}/api/Image/download/${id}`;

/**
 * Delete an image by its id.
 */
export const deleteImage = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Image/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error deleting image ${id}:`, res.status, errorText);
    return { error: errorText || 'Failed to delete image' };
  }

  return {};
};

/**
 * Upload a new image file to the server.
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/Image/upload`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error uploading image:', res.status, errorText);
    throw new Error(errorText || 'Failed to upload image');
  }

  return res.json(); // returns the created image info (id, createdAt, creatorId)
};
