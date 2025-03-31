import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // for modal
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    getUsers().then(data => {
      if (Array.isArray(data)) setUsers(data);
      else console.error('Expected array, got:', data);
    });
  }, []);

  const handleDelete = async (userID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const res = await deleteUser(userID);
    console.log(res.message);
    setUsers(users.filter(u => u.userID !== userID));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdate = async () => {
    const res = await updateUser(editingUser.userID, form);
    console.log(res.message);

    setUsers(users.map(u => u.userID === editingUser.userID ? { ...u, ...form } : u));
    setEditingUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userID}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.userID)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingUser && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            padding: '20px',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <h3>Edit User</h3>
          <div>
            <label>Name: </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label>Role: </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="sailor">Sailor</option>
              <option value="dock_owner">Dock Owner</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingUser(null)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
