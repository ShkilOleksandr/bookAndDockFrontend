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
    id:         0,
    title:      data.title,
    content:    data.content,
    createdBy:  Number(data.authorID),
    createdOn:  new Date(data.createdOn).toISOString(),
    isApproved: true,
  };

  const res = await fetch(`${BASE_URL}/api/Guide`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Failed to create guide');
  }

  // read raw text and only parse if non-empty
  const text = await res.text().catch(() => '');
  if (!text) return;
  return JSON.parse(text);
};

// guideService.js
export const updateGuide = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/guide/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id,
      title:     data.title,
      content:   data.content,
      createdBy: Number(data.authorID),
      createdOn: new Date(data.createdOn).toISOString(),
      isApproved:true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Failed to update guide ${id}`);
  }

  // Safely handle empty‐body responses:
  const text = await res.text().catch(() => '');
  if (!text) return;
  return JSON.parse(text);
};

export const deleteGuide = async (id) => {
  const res = await fetch(`${BASE_URL}/api/guide/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  // 1) error‐check
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Failed to delete guide ${id}`);
  }

  // 2) read the raw text
  const text = await res.text().catch(() => '');

  // 3) only parse if non‐empty
  if (!text) {
    return;     // nothing to return on a 204
  }

  return JSON.parse(text);
};
