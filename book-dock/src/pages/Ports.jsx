// src/pages/Ports.jsx
import React, { useEffect, useState } from 'react';
import {
  getPorts,
  createPort,
  updatePort,
  deletePort
} from '../services/portService';
import './styling/Users.css';

const sortById = (a, b) => a.id - b.id;

export default function Ports() {
  const [ports, setPorts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editingPort, setEditingPort] = useState(null); 
  const [form, setForm]           = useState({
    name: '',
    description: '',
    ownerId: '',
    isApproved: false
  });

  // load list on mount
  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPorts();
      setPorts(Array.isArray(data) ? data.sort(sortById) : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load ports');
    } finally {
      setLoading(false);
    }
  };

  const onAddClick = () => {
    setEditingPort({}); // treat {} as "new"
    setForm({
      name: '',
      description: '',
      ownerId: '',
      isApproved: false
    });
  };

  const handleEditClick = port => {
    setEditingPort(port);
    setForm({
      name:        port.name,
      description: port.description || '',
      ownerId:     port.ownerId?.toString() || '',
      isApproved:  !!port.isApproved
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this port?')) return;
    try {
      await deletePort(id);
      setPorts(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Could not delete port: ' + err.message);
    }
  };

  const handleSave = async () => {
    const payload = {
      name:        form.name,
      description: form.description,
      ownerId:     Number(form.ownerId),
      isApproved:  form.isApproved
    };

    try {
      if (editingPort.id != null) {
        await updatePort(editingPort.id, { id: editingPort.id, ...payload });
      } else {
        await createPort(payload);
      }
      await loadPorts();
      setEditingPort(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save port: ' + err.message);
    }
  };

  if (loading) {
    return <div style={{ padding:20, textAlign:'center' }}><p>Loading ports…</p></div>;
  }
  if (error) {
    return <div style={{ padding:20, textAlign:'center', color:'red' }}><p>Error: {error}</p></div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Ports</h2>
      <button
        className="btn btn-new"
        style={{ marginBottom: '15px' }}
        onClick={onAddClick}
      >
        + Add Port
      </button>

      {ports.length === 0 ? (
        <p>No ports found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Created On</th>
              <th>Name</th>
              <th>Description</th>
              <th>OwnerId</th>
              <th>Approved?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ports.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{new Date(p.createdOn).toLocaleString()}</td>
                <td>{p.name}</td>
                <td>{p.description || '—'}</td>
                <td>{p.ownerId}</td>
                <td>{p.isApproved ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(p)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingPort != null && (
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
          width: '400px',
          maxWidth: '90vw'
        }}>
          <h3>{editingPort.id != null
            ? `Edit Port #${editingPort.id}`
            : 'New Port'}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>
              Name<br/>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label>
              Description<br/>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label>
              Owner ID<br/>
              <input
                type="number"
                value={form.ownerId}
                onChange={e => setForm(f => ({ ...f, ownerId: e.target.value }))}
              />
            </label>
            <label>
              Approved?<br/>
              <input
                type="checkbox"
                checked={form.isApproved}
                onChange={e => setForm(f => ({ ...f, isApproved: e.target.checked }))}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>
              {editingPort.id != null ? 'Save' : 'Create'}
            </button>
            <button
              onClick={() => setEditingPort(null)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
