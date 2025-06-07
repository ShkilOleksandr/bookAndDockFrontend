// src/services/reviewService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No token found in localStorage!');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Fetch all reviews, optionally filtered by dockId (portId).
 * @param {number} [dockId]
 */
export const getReviews = async (dockId) => {
  const params = new URLSearchParams();
  if (dockId != null) {
    params.append('dockId', dockId);
  }

  const url = `${BASE_URL}/api/review${params.toString() ? '?' + params : ''}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching reviews:', res.status, errorText);
    return []; // return empty array so UI doesn’t break
  }

  return res.json(); // array of ReviewReturnDto
};

/**
 * Update a review by its ID. Expects an object of updated fields.
 */
export const updateReview = async (id, data) => {
  const url = `${BASE_URL}/api/review/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error updating review ${id}:`, res.status, errorText);
    return { error: errorText || 'Failed to update review' };
  }

  // read the raw body:
  const text = await res.text();
  if (!text) {
    // no JSON in the body; assume success with no data
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('Failed to parse JSON after update:', e);
    return {};
  }
};

/**
 * Delete a review by its ID.
 */
export const deleteReview = async (id) => {
  const url = `${BASE_URL}/api/review/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error deleting review ${id}:`, res.status, errorText);
    return { error: errorText || 'Failed to delete review' };
  }

  return res.json();
};
