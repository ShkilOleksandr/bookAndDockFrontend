// src/pages/Locations.jsx
import React, { useEffect, useState } from 'react';
import {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from '../services/locationService';
import './styling/Users.css';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [mode, setMode] = useState(null); 
  const [form, setForm] = useState({
    latitude:  '',
    longitude: '',
    town:      '',
    portId:    '',
    createdOn: '', // YYYY-MM-DD
  });

  const sortByTown = (a, b) =>
    a.town.localeCompare(b.town, undefined, { sensitivity: 'base' });

  useEffect(() => {
    getLocations()
      .then(data => {
        if (Array.isArray(data)) {
          setLocations(data.slice().sort(sortByTown));
        } else {
          console.error('Expected array, got:', data);
          setLocations([]);
        }
      })
      .catch(err => {
        console.error('Failed to load locations:', err);
        setLocations([]);
      });
  }, []);

  const onNewClick = () => {
    setMode('new');
    setEditingLocation(null);
    setForm({
      latitude:  '',
      longitude: '',
      town:      '',
      portId:    '',
      createdOn: '',
    });
  };

  const handleEditClick = loc => {
    setMode('edit');
    setEditingLocation(loc);
    setForm({
      latitude:  `${loc.latitude  ?? ''}`,
      longitude: `${loc.longitude ?? ''}`,
      town:      loc.town         ?? '',
      portId:    loc.portId != null ? `${loc.portId}` : '',
      createdOn: loc.createdOn ? loc.createdOn.slice(0, 10) : '',
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await deleteLocation(id);
      setLocations(ls => ls.filter(l => l.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete location');
    }
  };

  const handleSave = async () => {
    const payload = {
      latitude:  parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      town:      form.town,
      portId:    Number(form.portId),
      createdOn: form.createdOn,
    };

    try {
      if (mode === 'new') {
        const created = await addLocation(payload);
        if (created) {
          setLocations(ls => [...ls, created].sort(sortByTown));
        } else {
          const fresh = await getLocations();
          setLocations(fresh.sort(sortByTown));
        }
      } else {
        await updateLocation(editingLocation.id, payload);
        setLocations(ls =>
          ls
            .map(l =>
              l.id === editingLocation.id
                ? { ...l, ...payload }
                : l
            )
            .sort(sortByTown)
        );
      }
      setMode(null);
      setEditingLocation(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save location');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Locations</h2>

      <button className="btn btn-new" onClick={onNewClick}>
        + Add Location
      </button>

      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Town</th>
              <th>PortId</th>
              <th>CreatedOn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.latitude}</td>
                <td>{l.longitude}</td>
                <td>{l.town}</td>
                <td>{l.portId}</td>
                <td>{new Date(l.createdOn).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(l)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(l.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(mode === 'new' || mode === 'edit') && (
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
            width: '400px',
            maxWidth: '90vw',
          }}
        >
          <h3>{mode === 'new' ? 'New Location' : `Edit Location #${editingLocation.id}`}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>
              Latitude<br/>
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
              />
            </label>
            <label>
              Longitude<br/>
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
              />
            </label>
            <label>
              Town<br/>
              <input
                name="town"
                value={form.town}
                onChange={e => setForm(f => ({ ...f, town: e.target.value }))}
              />
            </label>
            <label>
              Port ID<br/>
              <input
                name="portId"
                type="number"
                value={form.portId}
                onChange={e => setForm(f => ({ ...f, portId: e.target.value }))}
              />
            </label>
            <label>
              Created On<br/>
              <input
                name="createdOn"
                type="date"
                value={form.createdOn}
                onChange={e => setForm(f => ({ ...f, createdOn: e.target.value }))}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>
              {mode === 'new' ? 'Create' : 'Save'}
            </button>
            <button onClick={() => { setMode(null); setEditingLocation(null); }} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
