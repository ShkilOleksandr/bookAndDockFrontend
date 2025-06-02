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
 * Fetch all reviews, optionally filtered by portId.
 * @param {number} [portId]
 */
export const getReviews = async (portId) => {
  const params = new URLSearchParams();
  if (portId != null) {
    params.append('portId', portId);
  }

  const url = `${BASE_URL}/api/review`;
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
