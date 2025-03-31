export const getUsers = async () => {
    const res = await fetch('/admin/users');
    return res.json();
  };
  
  export const updateUser = async (userID, data) => {
    const res = await fetch(`/admin/users/${userID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  };
  
  export const deleteUser = async (userID) => {
    const res = await fetch(`/admin/users/${userID}`, {
      method: 'DELETE',
    });
    return res.json();
  };
  