const BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn("⚠️ No token found in localStorage!");
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    // Try to read text response to log for debugging
    const errorText = await res.text();
    console.error('Error fetching users:', res.status, errorText);
    return []; // return an empty array so your UI doesn't break
  }

  return res.json(); // safe now, since res.ok is true
};

export const updateUser = async (id, data) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
};
