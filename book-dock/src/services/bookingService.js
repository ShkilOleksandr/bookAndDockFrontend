// src/services/bookingService.js

const BASE_URL =
  'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) console.warn('⚠️ No token found in localStorage!');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/Booking`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error fetching bookings:', res.status, text);
    throw new Error(text || 'Failed to fetch bookings');
  }
  return res.json();
};

export const createBooking = async (data) => {
  const res = await fetch(`${BASE_URL}/api/Booking`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      sailorId:      Number(data.sailorId),
      dockingSpotId: Number(data.dockingSpotId),
      startDate:     new Date(data.startDate).toISOString(),
      endDate:       new Date(data.endDate).toISOString(),
      people:        Number(data.people),
      payment: data.paymentMethod,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error creating booking:', res.status, text);
    throw new Error(text || 'Failed to create booking');
  }
  const text = await res.text().catch(() => '');
  return text ? JSON.parse(text) : undefined;
};

export const updateBooking = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/Booking/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id,
      sailorId:      Number(data.sailorId),
      dockingSpotId: Number(data.dockingSpotId),
      startDate:     new Date(data.startDate).toISOString(),
      endDate:       new Date(data.endDate).toISOString(),
      people:        Number(data.people),
      paymentMethod: data.paymentMethod,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`Error updating booking ${id}:`, res.status, text);
    throw new Error(text || `Failed to update booking ${id}`);
  }
  const text = await res.text().catch(() => '');
  return text ? JSON.parse(text) : undefined;
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/api/Booking/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`Error deleting booking ${id}:`, res.status, text);
    throw new Error(text || `Failed to delete booking ${id}`);
  }
  const text = await res.text().catch(() => '');
  return text ? JSON.parse(text) : undefined;
};
