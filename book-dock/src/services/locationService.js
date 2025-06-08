// src/services/locationService.js
const BASE_URL =
  'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) console.warn('⚠️ No token found in localStorage!');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const getLocations = async () => {
  const res = await fetch(`${BASE_URL}/api/Location`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error fetching locations:', res.status, text);
    throw new Error(text || 'Failed to fetch locations');
  }

  return res.json();
};

export const addLocation = async (data) => {
  const body = {
    id:            0,
    latitude:      data.latitude,
    longitude:     data.longitude,
    town:          data.town,
    portId:        Number(data.portId),
    dockingSpotId: Number(data.dockingSpotId),
    createdOn:     new Date(data.createdOn).toISOString(),
  };

  const res = await fetch(`${BASE_URL}/api/Location`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Failed to create location');
  }

  const text = await res.text().catch(() => '');
  if (!text) return;
  return JSON.parse(text);
};

export const updateLocation = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/Location/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id,
      latitude:      data.latitude,
      longitude:     data.longitude,
      town:          data.town,
      portId:        Number(data.portId),
      dockingSpotId: Number(data.dockingSpotId),
      createdOn:     new Date(data.createdOn).toISOString(),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Failed to update location ${id}`);
  }

  const text = await res.text().catch(() => '');
  if (!text) return;
  return JSON.parse(text);
};

export const deleteLocation = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Location/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Failed to delete location ${id}`);
  }

  const text = await res.text().catch(() => '');
  if (!text) return;
  return JSON.parse(text);
};
