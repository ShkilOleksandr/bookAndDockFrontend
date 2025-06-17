/* src/services/imageService.js */
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getImages = async () => {
  const res = await fetch(`${BASE_URL}/api/Image/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching images:', res.status, errorText);
    throw new Error(errorText || 'Failed to fetch images');
  }

  return res.json();
};

export const getImageUrl = (id) => `${BASE_URL}/api/Image/download/${id}`;

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

export const uploadImage = async (file, createdBy, guideId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('createdBy', createdBy);
  formData.append('guideId', guideId);

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

  return res.json();
};
