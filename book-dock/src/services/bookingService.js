// src/services/bookingService.js

const BASE_URL =
  'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) console.warn('⚠️ No token found in localStorage!');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * GET /api/Booking
 */
export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/Booking`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Error fetching bookings:', res.status, text);
    throw new Error(text || 'Failed to fetch bookings');
  }

  return res.json();
};

/**
 * PUT /api/Booking/{id}
 * @param {number} id
 * @param {object} payload  — the fields you want to update
 */
export const updateBooking = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/Booking/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Error updating booking ${id}:`, res.status, text);
    return { error: text || 'Failed to update booking' };
  }

  // If your API returns the updated object, you can `return res.json()`
  // Otherwise just signal success:
  return {};
};

/**
 * DELETE /api/Booking/{id}
 */
export const deleteBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Booking/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Error deleting booking ${id}:`, res.status, text);
    return { error: text || 'Failed to delete booking' };
  }

  return {};
};

/**
 * POST /api/Booking
 * @param {object} payload — the new booking fields
 * @returns the newly created booking (assuming your API returns it)
 */
export const createBooking = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/Booking`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Error creating booking:', res.status, text);
    throw new Error(text || 'Failed to create booking');
  }

  return res.json();
};