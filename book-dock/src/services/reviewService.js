// src/services/reviewService.js
const BASE_URL = 'https://book-and-dock-backend-app-684024935709.europe-north2.run.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

/**
 * Fetch all reviews, optionally filtered by portId.
 * @param {number} [portId]
 */
export const getReviews = async (portId) => {
  const params = new URLSearchParams();
  if (portId != null) params.append('portId', portId);
  const url = `${BASE_URL}/reviews${params.toString() ? '?' + params : ''}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // array of ReviewReturnDto
};
