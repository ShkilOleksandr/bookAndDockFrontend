// src/services/portService.js
const BASE_URL = 'https://book-and-dock-backend-app-684024935709.europe-north2.run.app/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

/**
 * Fetch all ports.
 * (Later you can add query params if you need filtering/paging.)
 */
export const getPorts = async () => {
  const url = `${BASE_URL}/ports`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch ports');
  }
  return res.json(); // expected array of PortReturnDto
};
