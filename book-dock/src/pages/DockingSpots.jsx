import React, { useEffect, useState } from 'react';
import { getDockingSpots, updateDockingSpot, deleteDockingSpot } from '../services/dockingSpotService';
import './styling/Users.css'; // Re-use table styles

// Utility to sort by name
const sortByName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

export default function DockingSpots() {
  const [spots, setSpots] = useState([]);
  const [editingSpot, setEditingSpot] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerNight: 0,
    pricePerPerson: 0,
    isAvailable: true
  });

  useEffect(() => {
    getDockingSpots()
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.slice().sort(sortByName);
          setSpots(sorted);
        } else {
          console.error('Expected array, got:', data);
        }
      })
      .catch(console.error);
  }, []);

  const handleDelete = async (spotId) => {
    if (!window.confirm('Are you sure you want to delete this docking spot?')) return;
    try {
      const res = await deleteDockingSpot(spotId);
      console.log(res.message);
      setSpots(spots.filter(s => s.id !== spotId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (spot) => {
    setEditingSpot(spot);
    setForm({
      name: spot.name,
      description: spot.description,
      pricePerNight: spot.pricePerNight,
      pricePerPerson: spot.pricePerPerson,
      isAvailable: spot.isAvailable
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateDockingSpot(editingSpot.id, form);
      console.log(res.message);
      setSpots(spots.map(s => s.id === editingSpot.id ? { ...s, ...form } : s));
      setEditingSpot(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Docking Spots</h2>
      {spots.length === 0 ? (
        <p>No docking spots found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
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
                <td>${spot.pricePerNight}</td>
                <td>${spot.pricePerPerson}</td>
                <td>{spot.isAvailable ? 'Yes' : 'No'}</td>
                <td>{new Date(spot.createdOn).toLocaleString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(spot)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(spot.id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingSpot && (
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
          <h3>Edit Docking Spot</h3>
          <div>
            <label>Name: </label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label>Description: </label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label>Price Per Night: </label>
            <input
              type="number"
              value={form.pricePerNight}
              onChange={e => setForm({ ...form, pricePerNight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Price Per Person: </label>
            <input
              type="number"
              value={form.pricePerPerson}
              onChange={e => setForm({ ...form, pricePerPerson: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Available: </label>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditingSpot(null)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
