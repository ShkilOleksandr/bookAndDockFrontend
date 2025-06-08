// src/services/serviceService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) console.warn('⚠️ No token found in localStorage!');
  return { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
}

export const getServices = async () => {
  const res = await fetch(`${BASE_URL}/api/Service`, { headers: getAuthHeaders() });
  if (!res.ok) { const txt = await res.text().catch(() => ''); throw new Error(txt || 'Failed to fetch services'); }
  return res.json();
};

export const addService = async data => {
  const res = await fetch(`${BASE_URL}/api/Service`, { headers: getAuthHeaders() });
  const contentType = res.headers.get('Content-Type') || ''
  const text = await res.text().catch(() => '')
  if (!res.ok) {
    throw new Error(text || 'Failed to create service')
  }
  if (!contentType.includes('application/json')) {
    throw new Error(text || 'Unexpected response from server')
  }
  return JSON.parse(text)
}
export const updateService = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/Service/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ id, name: data.name, description: data.description, price: data.price, portId: data.portId, dockingSpotId: data.dockingSpotId, isAvailable: data.isAvailable, createdOn: new Date(data.createdOn).toISOString() }) });
  if (!res.ok) { const txt = await res.text().catch(() => ''); throw new Error(txt || `Failed to update service ${id}`); }
  const text = await res.text().catch(() => ''); if (!text) return; return JSON.parse(text);
};

export const deleteService = async id => {
  const res = await fetch(`${BASE_URL}/api/Service/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) { const txt = await res.text().catch(() => ''); throw new Error(txt || `Failed to delete service ${id}`); }
  const text = await res.text().catch(() => ''); if (!text) return; return JSON.parse(text);
};
