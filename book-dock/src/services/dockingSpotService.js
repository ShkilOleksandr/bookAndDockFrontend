const BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

/**
 * Fetch all docking spots, optionally with query-filters.
 * @param {{ location?: string, date?: string, price?: number, services?: string, availability?: string }} [filters]
 */
export const getDockingSpots = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.location)    params.append('location', filters.location);
  if (filters.date)        params.append('date',     filters.date);
  if (filters.price != null)   params.append('price',    filters.price);
  if (filters.services)    params.append('services', filters.services);
  if (filters.availability) params.append('availability', filters.availability);

  const url = `${BASE_URL}/dockingSpots${params.toString() ? '?' + params : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();  // array of DockingSpotReturnDto
};
