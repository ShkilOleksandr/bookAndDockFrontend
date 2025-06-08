// src/services/guideService.js

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

// src/services/guideService.js
export const getGuides = async () => {
  const res = await fetch(`${BASE_URL}/api/Guide`, {
    headers: getAuthHeaders(),
    // (no credentials flag, just like your bookingService)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error fetching guides:', res.status, text);
    throw new Error(text || 'Failed to fetch guides');
  }

  return res.json();
};


export const addGuide = async (data) => {
  const body = {
    id: 0,
    title: data.title,
    content: data.content,
    createdBy: Number(data.authorID),
    createdOn: new Date(data.createdOn).toISOString(),
    isApproved: true,
  };

  const res = await fetch(`${BASE_URL}/api/Guide`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return res.json();
};

export const updateGuide = async (id, data) => {
  const body = {
    id,
    title: data.title,
    content: data.content,
    createdBy: Number(data.authorID),
    createdOn: new Date(data.createdOn).toISOString(),
    isApproved: true,
  };

  // note the `/${id}` in the path:
  const res = await fetch(`${BASE_URL}/api/Guide/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
export const deleteGuide = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Guide/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return res.json();
};
