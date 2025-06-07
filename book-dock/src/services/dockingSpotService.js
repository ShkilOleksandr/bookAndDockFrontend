const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  };
};

/**
 * Fetch all docking spots.
 */
export const getDockingSpots = async () => {
  const res = await fetch(`${BASE_URL}/api/ds`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // array of spots
};

/**
 * Update a docking spot.  
 * The API expects the full spot JSON, e.g.:
 * {
 *   id,
 *   name,
 *   description,
 *   ownerId,
 *   portId,
 *   pricePerNight,
 *   pricePerPerson,
 *   isAvailable,
 *   createdOn
 * }
 */
// dockingSpotService.js
export const updateDockingSpot = async (id, spot) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(spot),
  });
  if (!res.ok) {
    // if the server returns text errors, propagate them
    throw new Error(await res.text());
  }

  // only try JSON if the server really sent JSON
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  // otherwise, assume the server accepted it but didn't send JSON
  return spot;
};
export const deleteDockingSpot = async (id) => {
  const res = await fetch(`${BASE_URL}/api/ds/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  // Some APIs return 204 No Content, so we just return true:
  return true;
};