// src/services/dockingSpotService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

export const getDockingSpots = async () => {
  const res = await fetch(`${BASE_URL}/api/ds`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createDockingSpot = async (spot) => {
  const res = await fetch(`${BASE_URL}/api/ds`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(spot),
  });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
};

export const updateDockingSpot = async (id, spot) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(spot),
  });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : spot;
};

export const deleteDockingSpot = async (id) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
};
