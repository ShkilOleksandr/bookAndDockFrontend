// src/services/portService.js
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
 * Fetch all ports.
 * Returns an empty array on error (and logs the error details).
 */
export const getPorts = async () => {
  const url = `${BASE_URL}/api/Port`;
  const res = await fetch(url, { headers: getAuthHeaders() });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching ports:', res.status, errorText);
    return []; // return empty array so UI doesn’t break
  }

  return res.json(); // expected array of PortReturnDto
};
