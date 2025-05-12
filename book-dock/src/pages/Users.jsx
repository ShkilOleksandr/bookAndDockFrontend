
import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../services/userService';
import './styling/Users.css'; // Assuming you have some CSS for styling

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); 
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
    setUsers(users.filter(u => u.id !== userID));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      roleId: user.role?.id || ''
    });
  };

  const handleUpdate = async () => {
    const res = await updateUser(editingUser.id, form);
    console.log(res.message);

    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    setEditingUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className='user-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td>{user.role || 'N/A'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingUser && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          padding: '20px',
          border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}>
          <h3>Edit User</h3>
          <div>
            <label>Name: </label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label>Surname: </label>
            <input value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
          </div>
          <div>
            <label>Email: </label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label>Phone Number: </label>
            <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div>
            <label>Role: </label>
            <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: parseInt(e.target.value) })}>
              <option value="">Select role</option>
              <option value={1}>Sailor</option>
              <option value={2}>Dock Owner</option>
              <option value={3}>Editor</option>
              <option value={4}>Admin</option>
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
