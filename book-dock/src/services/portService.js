// src/services/portService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

export const getPorts = async () => {
  const res = await fetch(`${BASE_URL}/api/Port`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Error fetching ports: ${res.status} ${await res.text()}`);
  }
  return res.json();
};

export const createPort = async (port) => {
  const res = await fetch(`${BASE_URL}/api/Port`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(port)
  });
  if (!res.ok) {
    throw new Error(`Error creating port: ${res.status} ${await res.text()}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
};

export const updatePort = async (id, port) => {
  const res = await fetch(`${BASE_URL}/api/Port/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(port)
  });
  if (!res.ok) {
    throw new Error(`Error updating port: ${res.status} ${await res.text()}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
};

export const deletePort = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Port/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Error deleting port: ${res.status} ${await res.text()}`);
  }
  return true;
};
