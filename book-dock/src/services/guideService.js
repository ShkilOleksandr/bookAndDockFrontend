// src/services/guideService.js

// pull in your base-URL and token
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResp(res) {
  if (!res.ok) {
    // try to pull out a JSON error message
    let errText = '';
    try { errText = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText}${errText ? ` — ${errText}` : ''}`);
  }
  return res.json();
}

// GET /api/Guide
export function getGuides() {
  return fetch(`${apiBase}/api/Guide`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(handleResp);
}

// POST /api/Guide
export function addGuide({ title, content, authorID, createdOn }) {
  const body = {
    id: 0,
    title,
    content,
    createdBy: Number(authorID),
    createdOn: new Date(createdOn).toISOString(),
    isApproved: true
  };
  return fetch(`${apiBase}/api/Guide`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body)
  }).then(handleResp);
}

// PUT /api/Guide
export function updateGuide(id, { title, content, authorID, createdOn }) {
  const body = {
    id,
    title,
    content,
    createdBy: Number(authorID),
    createdOn: new Date(createdOn).toISOString(),
    isApproved: true
  };
  return fetch(`${apiBase}/api/Guide`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body)
  }).then(handleResp);
}

// DELETE /api/Guide/{id}
export function deleteGuide(id) {
  return fetch(`${apiBase}/api/Guide/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(handleResp);
}
