// src/services/serviceService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) console.warn('⚠️ No token found in localStorage!');
  return { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
}

export const getServices = async () => {
  const res = await fetch(`${BASE_URL}/api/Service`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || 'Failed to fetch services');
  }
  return res.json();
};

export const addService = async (data) => {
  // build payload matching backend expectations
  const payload = {
    id:            0,
    name:          data.name,
    description:   data.description,
    price:         data.price,
    portId:        data.portId,
    dockingSpotId: data.dockingSpotId,
    isAvailable:   data.isAvailable,
    createdOn:     new Date(data.createdOn).toISOString(),
  };

  const res = await fetch(`${BASE_URL}/api/Service`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => '');

  if (!res.ok) {
    if (res.status === 500 && text === '') {
      console.warn('Service created but server returned 500 with no content; continuing as success');
      return null;
    }
    console.error('Error creating service:', res.status, text);
    throw new Error(text || 'Failed to create service');
  }

  return text ? JSON.parse(text) : null;
};



export const updateService = async (id, data) => {
  const payload = {
    id,
    name:          data.name,
    description:   data.description,
    price:         data.price,
    portId:        data.portId,
    dockingSpotId: data.dockingSpotId,
    isAvailable:   data.isAvailable,
    createdOn:     new Date(data.createdOn).toISOString(),
  };

  const res = await fetch(`${BASE_URL}/api/Service/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error(`Failed to update service ${id}:`, res.status, txt);
    throw new Error(txt || `Failed to update service ${id}`);
  }
  const text = await res.text().catch(() => '');
  if (!text) return null;
  return JSON.parse(text);
};

export const deleteService = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Service/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error(`Failed to delete service ${id}:`, res.status, txt);
    throw new Error(txt || `Failed to delete service ${id}`);
  }
  const text = await res.text().catch(() => '');
  if (!text) return null;
  return JSON.parse(text);
};
