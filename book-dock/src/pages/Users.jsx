// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../services/userService';
import './styling/Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [mode, setMode] = useState(null); 
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: ''
  });

  const sortByNameThenSurname = (a, b) => {
    const n = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    if (n !== 0) return n;
    return a.surname.localeCompare(b.surname, undefined, { sensitivity: 'base' });
  };

  const loadUsers = () => {
    getUsers().then(data => {
      if (Array.isArray(data)) {
        setUsers(data.slice().sort(sortByNameThenSurname));
      } else {
        console.error('Expected array, got:', data);
        setUsers([]);
      }
    }).catch(err => {
      console.error('Failed to load users:', err);
      setUsers([]);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onNewClick = () => {
    setMode('new');
    setEditingUser(null);
    setForm({ name: '', surname: '', email: '', phoneNumber: '', role: '', password: '' });
  };

  const handleDelete = async (userID) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(userID);
      setUsers(us => us.filter(u => u.id !== userID));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setMode('edit');
    setEditingUser(user);
    setForm({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      role: user.role || '',
      password: ''
    });
  };

  const handleSave = async () => {
    try {
      if (mode === 'new') {
        if (!form.password) {
          alert('Password is required for new users');
          return;
        }
        await addUser(form);
        loadUsers();
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(editingUser.id, payload);
        setUsers(us => us.map(u => u.id === editingUser.id ? { ...u, ...form } : u).sort(sortByNameThenSurname));
      }
      setMode(null);
      setEditingUser(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Users</h2>
      <button className="btn btn-new" onClick={onNewClick}>+ Add User</button>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className='user-table'>
          <thead>
            <tr>
              <th>Name</th><th>Surname</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td><td>{user.surname}</td><td>{user.email}</td><td>{user.phoneNumber || 'N/A'}</td><td>{user.role || 'N/A'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(mode === 'new' || mode === 'edit') && (
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '20px', border: '1px solid #ccc', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 1000, width: '400px', maxWidth: '90vw' }}>
          <h3>{mode === 'new' ? 'New User' : `Edit User #${editingUser.id}`}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>Name<br/><input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></label>
            <label>Surname<br/><input name="surname" value={form.surname} onChange={e => setForm(f => ({ ...f, surname: e.target.value }))}/></label>
            <label>Email<br/><input name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}/></label>
            <label>Phone Number<br/><input name="phoneNumber" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}/></label>
            <label>Role<br/><select name="role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}><option value="">Select role</option><option value="User">User</option><option value="Owner">Owner</option><option value="Admin">Admin</option></select></label>
            {mode === 'new' && (
              <label>Password<br/><input name="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}/></label>
            )}
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>{mode === 'new' ? 'Create' : 'Save'}</button>
            <button onClick={() => { setMode(null); setEditingUser(null); }} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
