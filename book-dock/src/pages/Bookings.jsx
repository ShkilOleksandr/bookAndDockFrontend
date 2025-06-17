import React, { useEffect, useState } from 'react';
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/bookingService';
import { getAllPaymentMethods } from '../services/paymentService';
import './styling/Users.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [mode, setMode] = useState(null); 
  const [form, setForm] = useState({
    sailorId: '',
    dockingSpotId: '',
    startDate: '',
    endDate: '',
    people: '',
    paymentMethod: '',
  });
  const [paymentMethodNames, setPaymentMethodNames] = useState([]);
  const [paymentMethodMap, setPaymentMethodMap] = useState({});
  const sortById = (a, b) => a.id - b.id;

  useEffect(() => {
  const loadData = async () => {
    try {
      const [bookingsData, methods] = await Promise.all([
        getBookings(),
        getAllPaymentMethods()
      ]);
      setBookings(bookingsData.sort(sortById));
      setPaymentMethodNames(methods.map(m => m.name));

      const idToNameMap = {};
      methods.forEach(m => {
        idToNameMap[m.id] = m.name;
      });
      setPaymentMethodMap(idToNameMap);
    } catch (err) {
      console.error('Failed to load data:', err);
      setBookings([]);
      setPaymentMethodNames([]);
    }
  };
  loadData();
}, []);

  const resetForm = () => setForm({
    sailorId: '',
    dockingSpotId: '',
    startDate: '',
    endDate: '',
    people: '',
    paymentMethod: '',
  });

  const onNewClick = () => {
    setMode('new');
    setEditingBooking(null);
    resetForm();
  };

  const handleEditClick = (b) => {
    setMode('edit');
    setEditingBooking(b);
    setForm({
      sailorId: b.sailorId.toString(),
      dockingSpotId: b.dockingSpotId.toString(),
      startDate: b.startDate.slice(0, 10),
      endDate: b.endDate.slice(0, 10),
      people: b.people.toString(),
      paymentMethod: b.paymentMethod?.name || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await deleteBooking(id);
    setBookings(bs => bs.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    const payload = {
      sailorId: Number(form.sailorId),
      dockingSpotId: Number(form.dockingSpotId),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      people: Number(form.people),
      paymentMethod: form.paymentMethod, 
    };

    try {
      if (mode === 'new') {
        const created = await createBooking(payload);
        if (created) {
          setBookings(bs => [...bs, created].sort(sortById));
        } else {
          const fresh = await getBookings();
          setBookings(fresh.sort(sortById));
        }
      } else {
        await updateBooking(editingBooking.id, payload);
        setBookings(bs =>
          bs.map(b =>
            b.id === editingBooking.id ? {
            ...b,
            sailorId: payload.sailorId,
            dockingSpotId: payload.dockingSpotId,
            startDate: payload.startDate,
            endDate: payload.endDate,
            people: payload.people,
            paymentMethodId: Object.keys(paymentMethodMap).find(id => paymentMethodMap[id] === form.paymentMethod),
          } : b
          ).sort(sortById)
        );
      }
      setMode(null);
      setEditingBooking(null);
      resetForm();
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save booking');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Bookings</h2>
      <button className="btn btn-new" onClick={onNewClick} style={{ marginBottom: '15px' }}>
        + Add Booking
      </button>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th><th>Sailor</th><th>Spot</th><th>Start</th><th>End</th><th>People</th><th>Payment</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.sailorId}</td>
                <td>{b.dockingSpotId}</td>
                <td>{new Date(b.startDate).toLocaleDateString()}</td>
                <td>{new Date(b.endDate).toLocaleDateString()}</td>
                <td>{b.people}</td>
                <td>{paymentMethodMap[b.paymentMethodId] || 'Unknown'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(b)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(b.id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(mode === 'new' || mode === 'edit') && (
        <div style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          background: '#fff', padding: '20px', border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 1000,
          width: '400px', maxWidth: '90vw'
        }}>
          <h3>{mode === 'new' ? 'New Booking' : `Edit Booking #${editingBooking.id}`}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>SailorId<br /><input value={form.sailorId} onChange={e => setForm(f => ({ ...f, sailorId: e.target.value }))} /></label>
            <label>DockingSpotId<br /><input value={form.dockingSpotId} onChange={e => setForm(f => ({ ...f, dockingSpotId: e.target.value }))} /></label>
            <label>StartDate<br /><input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></label>
            <label>EndDate<br /><input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></label>
            <label>People<br /><input type="number" value={form.people} onChange={e => setForm(f => ({ ...f, people: e.target.value }))} /></label>
            <label>Payment Method<br />
              <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                <option value="">-- Select --</option>
                {paymentMethodNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>{mode === 'new' ? 'Create' : 'Save'}</button>
            <button onClick={() => { setMode(null); setEditingBooking(null); resetForm(); }} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
