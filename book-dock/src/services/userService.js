// src/services/userService.js
const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) console.warn("⚠️ No token found in localStorage!");
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('Error fetching users:', res.status, errorText);
    return [];
  }
  return res.json();
};

export const addUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/Auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Failed to register user');
  }
  return true;
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