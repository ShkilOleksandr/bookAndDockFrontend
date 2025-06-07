// src/services/commentService.js

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
 * Fetch all comments (optionally filtered by guideId).
 * @param {number} [guideId]
 * @returns {Promise<Array>} Array of Comment DTOs (or [] on failure).
 */
export const getComments = async (guideId) => {
  const params = new URLSearchParams();
  if (guideId != null) {
    params.append('guideId', guideId);
  }

  const url = `${BASE_URL}/api/Comment${params.toString() ? '?' + params : ''}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error fetching comments:', res.status, errorText);
    return []; // return empty array so UI doesn’t break
  }

  return res.json(); // array of CommentReturnDto
};

/**
 * Update a comment by its ID. `data` should contain the fields you want to update.
 * Returns updated comment on success, or { error: string } on failure.
 */
export const updateComment = async (data) => {
  const url = `${BASE_URL}/api/Comment`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `Error updating comment ${data.id}:`,
      res.status,
      errorText
    );
    return { error: errorText || 'Failed to update comment' };
  }

  // if status is 204 or no body, just return the DTO we sent
  if (res.status === 204 || res.headers.get('Content-Length') === '0') {
    return data;
  }

  // otherwise parse the JSON
  return res.json();
};

/**
 * Delete a comment by its ID.
 * Returns success message or { error: string } on failure.
 */
export const deleteComment = async (id) => {
  const url = `${BASE_URL}/api/Comment/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error deleting comment ${id}:`, res.status, errorText);
    return { error: errorText || 'Failed to delete comment' };
  }

  return res.json();
};
