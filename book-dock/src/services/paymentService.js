const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getPaymentMethod = async (id) => {
  const res = await fetch(`${BASE_URL}/api/pm/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch payment method ${id}`);
  }
  return res.text(); // returns plain string, like "Online"
};
export const getAllPaymentMethods = async () => {
  const res = await fetch(`${BASE_URL}/api/pm`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch payment methods');
  return res.json(); // assuming returns [{id, name}]
};