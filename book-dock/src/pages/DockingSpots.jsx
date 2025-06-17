// src/pages/DockingSpots.jsx
import React, { useEffect, useState } from 'react';
import {
  getDockingSpots,
  createDockingSpot,
  updateDockingSpot,
  deleteDockingSpot,
} from '../services/dockingSpotService';
import './styling/Users.css';

const sortByName = (a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

export default function DockingSpots() {
  const [spots, setSpots] = useState([]);
  const [editingSpot, setEditingSpot] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    ownerId: '',
    portId: '',
    pricePerNight: '',
    pricePerPerson: '',
    isAvailable: true,
  });

  useEffect(() => {
    getDockingSpots()
      .then(data => {
        if (Array.isArray(data)) {
          setSpots(data.slice().sort(sortByName));
        }
      })
      .catch(err => console.error('Load failed:', err));
  }, []);

  const handleAddClick = () => {
    setEditingSpot({}); // no id = "new"
    setForm({
      name: '',
      description: '',
      ownerId: '',
      portId: '',
      pricePerNight: '',
      pricePerPerson: '',
      isAvailable: true,
    });
  };

  const handleEditClick = (spot) => {
    setEditingSpot(spot);
    setForm({
      name: spot.name,
      description: spot.description,
      ownerId: spot.ownerId?.toString() || '',
      portId: spot.portId?.toString() || '',
      pricePerNight: spot.pricePerNight?.toString() || '',
      pricePerPerson: spot.pricePerPerson?.toString() || '',
      isAvailable: spot.isAvailable,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this spot?')) return;
    try {
      await deleteDockingSpot(id);
      setSpots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete: ' + err.message);
    }
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      ownerId: Number(form.ownerId),
      portId: Number(form.portId),
      pricePerNight: Number(form.pricePerNight),
      pricePerPerson: Number(form.pricePerPerson),
      isAvailable: form.isAvailable,
    };

    try {
      if (editingSpot.id != null) {
        const updated = await updateDockingSpot(editingSpot.id, { id: editingSpot.id, ...payload });
        setSpots(prev =>
          prev.map(s => s.id === updated.id ? updated : s).sort(sortByName)
        );
      }else {
        
        await createDockingSpot(payload);
        
        const all = await getDockingSpots();
        setSpots(all.sort(sortByName));
       }
      setEditingSpot(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Could not save: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Docking Spots</h2>
      <button
        className="btn btn-new"
        style={{ marginBottom: '15px' }}
        onClick={handleAddClick}
      >
        + Add Docking Spot
      </button>

      {spots.length === 0 ? (
        <p>No docking spots found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>OwnerId</th>
              <th>PortId</th>
              <th>Price/Night</th>
              <th>Price/Person</th>
              <th>Available?</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {spots.map(spot => (
              <tr key={spot.id}>
                <td>{spot.name}</td>
                <td>{spot.description}</td>
                <td>{spot.ownerId}</td>
                <td>{spot.portId}</td>
                <td>${spot.pricePerNight}</td>
                <td>${spot.pricePerPerson}</td>
                <td>{spot.isAvailable ? 'Yes' : 'No'}</td>
                <td>{new Date(spot.createdOn).toLocaleString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(spot)}>Edit</button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(spot.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingSpot != null && (
        <div style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          background: '#fff', padding: '20px', border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 1000,
          width: '400px', maxWidth: '90vw'
        }}>
          <h3>{editingSpot.id != null ? `Edit Docking Spot #${editingSpot.id}` : 'New Docking Spot'}</h3>
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
              Port ID<br/>
              <input
                type="number"
                value={form.portId}
                onChange={e => setForm(f => ({ ...f, portId: e.target.value }))}
              />
            </label>
            <label>
              Price Per Night<br/>
              <input
                type="number"
                value={form.pricePerNight}
                onChange={e => setForm(f => ({ ...f, pricePerNight: e.target.value }))}
              />
            </label>
            <label>
              Price Per Person<br/>
              <input
                type="number"
                value={form.pricePerPerson}
                onChange={e => setForm(f => ({ ...f, pricePerPerson: e.target.value }))}
              />
            </label>
            <label>
              Available<br/>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>
              {editingSpot.id != null ? 'Save' : 'Create'}
            </button>
            <button
              onClick={() => setEditingSpot(null)}
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
