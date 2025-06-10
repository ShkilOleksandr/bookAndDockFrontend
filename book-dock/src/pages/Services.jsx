// src/pages/Services.jsx
import React, { useEffect, useState } from 'react';
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from '../services/serviceService';
import './styling/Users.css'; // reuse your .user-table, .btn, etc.

export default function Services() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [mode, setMode] = useState(null); // 'new' or 'edit'
  const [form, setForm] = useState({
    name:          '',
    description:   '',
    price:         '',
    portId:        '',
    dockingSpotId: '',
    isAvailable:   false,
    createdOn:     '', // YYYY-MM-DD
  });

  const sortByName = (a, b) =>
    (a?.name || '').localeCompare(b?.name || '', undefined, { sensitivity: 'base' });

  const loadServices = async () => {
    try {
      const data = await getServices();
      if (Array.isArray(data)) {
        setServices(data.slice().sort(sortByName));
      } else {
        console.error('Expected array, got:', data);
        setServices([]);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices([]);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const onNewClick = () => {
    setMode('new');
    setEditingService(null);
    setForm({ name: '', description: '', price: '', portId: '', dockingSpotId: '', isAvailable: false, createdOn: '' });
  };

  const handleEditClick = svc => {
    setMode('edit');
    setEditingService(svc);
    setForm({
      name:          svc.name,
      description:   svc.description,
      price:         svc.price?.toString() || '',
      portId:        svc.portId?.toString() || '',
      dockingSpotId: svc.dockingSpotId?.toString() || '',
      isAvailable:   !!svc.isAvailable,
      createdOn:     svc.createdOn ? svc.createdOn.slice(0, 10) : '',
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setServices(ss => ss.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete service');
    }
  };

  const handleSave = async () => {
    const payload = {
      name:          form.name,
      description:   form.description,
      price:         parseFloat(form.price),
      portId:        Number(form.portId),
      dockingSpotId: Number(form.dockingSpotId),
      isAvailable:   form.isAvailable,
      createdOn:     form.createdOn,
    };

    try {
      if (mode === 'new') {
        const created = await addService(payload);
        if (created) {
          setServices(ss => [...ss, created].sort(sortByName));
        } else {
          await loadServices();
        }
      } else {
        await updateService(editingService.id, payload);
        setServices(ss =>
          ss
            .map(s => s.id === editingService.id ? { ...s, ...payload } : s)
            .sort(sortByName)
        );
      }
      setMode(null);
      setEditingService(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save service');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Services</h2>
      <button className="btn btn-new" onClick={onNewClick}>+ Add Service</button>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>PortId</th>
              <th>DockingSpotId</th>
              <th>Available</th>
              <th>CreatedOn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{s.price}</td>
                <td>{s.portId}</td>
                <td>{s.dockingSpotId}</td>
                <td>{s.isAvailable ? 'Yes' : 'No'}</td>
                <td>{new Date(s.createdOn).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(s)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(s.id)} style={{ marginLeft: '10px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(mode === 'new' || mode === 'edit') && (
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '20px', border: '1px solid #ccc', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 1000, width: '400px', maxWidth: '90vw' }}>
          <h3>{mode === 'new' ? 'New Service' : `Edit Service #${editingService.id}`}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>Name<br/><input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></label>
            <label>Description<br/><textarea name="description" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/></label>
            <label>Price<br/><input name="price" type="number" step="any" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}/></label>
            <label>Port ID<br/><input name="portId" type="number" value={form.portId} onChange={e => setForm(f => ({ ...f, portId: e.target.value }))}/></label>
            <label>Docking Spot ID<br/><input name="dockingSpotId" type="number" value={form.dockingSpotId} onChange={e => setForm(f => ({ ...f, dockingSpotId: e.target.value }))}/></label>
            <label>Available<br/><input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}/></label>
            <label>Created On<br/><input name="createdOn" type="date" value={form.createdOn} onChange={e => setForm(f => ({ ...f, createdOn: e.target.value }))}/></label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>{mode === 'new' ? 'Create' : 'Save'}</button>
            <button onClick={() => { setMode(null); setEditingService(null); }} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
