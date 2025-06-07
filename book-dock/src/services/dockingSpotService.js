const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

/**
 * Fetch all docking spots, optionally with filters.
 * @param {{ location?: string, date?: string, price?: number, services?: string, availability?: string }} [filters]
 */
export const getDockingSpots = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.location)     params.append('location', filters.location);
  if (filters.date)         params.append('date',     filters.date);
  if (filters.price != null)params.append('price',    filters.price);
  if (filters.services)     params.append('services', filters.services);
  if (filters.availability) params.append('availability', filters.availability);

  const url = `${BASE_URL}/api/ds`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

/**
 * Update a docking spot by ID.
 * @param {number|string} id
 * @param {object} payload
 */
export const updateDockingSpot = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

/**
 * Delete a docking spot by ID.
 * @param {number|string} id
 */
export const deleteDockingSpot = async (id) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
