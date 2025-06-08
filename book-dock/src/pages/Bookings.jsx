// src/pages/Bookings.jsx
import React, { useEffect, useState } from 'react';
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/bookingService';
import './styling/Users.css';

export default function Bookings() {
  const [bookings, setBookings]             = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [mode, setMode]                     = useState(null); // 'new' | 'edit'
  const [form, setForm] = useState({
    sailorId:      '',
    dockingSpotId: '',
    dockId:        '',
    startDate:     '',
    endDate:       '',
    people:        '',
    paymentMethod: '',
  });

  const sortById = (a, b) => a.id - b.id;

  useEffect(() => {
    getBookings()
      .then(data => setBookings(data.slice().sort(sortById)))
      .catch(err => {
        console.error('Failed to load bookings:', err);
        setBookings([]);
      });
  }, []);

  const resetForm = () => setForm({
    sailorId:      '',
    dockingSpotId: '',
    dockId:        '',
    startDate:     '',
    endDate:       '',
    people:        '',
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
      sailorId:      b.sailorId.toString(),
      dockingSpotId: b.dockingSpotId.toString(),
      dockId:        (b.dockId ?? '').toString(),
      startDate:     b.startDate.slice(0,10),
      endDate:       b.endDate.slice(0,10),
      people:        b.people.toString(),
      paymentMethod: b.paymentMethod || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await deleteBooking(id);
    setBookings(bs => bs.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    const payload = { ...form };
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
          bs.map(b => b.id === editingBooking.id ? { ...b, ...payload } : b)
            .sort(sortById)
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
      {/* <button className="btn btn-new" onClick={onNewClick}>+ Add Booking</button> */}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th><th>Sailor</th><th>Dock</th><th>Spot</th><th>Start</th><th>End</th><th>People</th><th>Payment</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.sailorId}</td>
                <td>{b.dockId}</td>
                <td>{b.dockingSpotId}</td>
                <td>{new Date(b.startDate).toLocaleDateString()}</td>
                <td>{new Date(b.endDate).toLocaleDateString()}</td>
                <td>{b.people}</td>
                <td>{b.paymentMethod}</td>
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
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', background:'#fff', padding:'20px', border:'1px solid #ccc', boxShadow:'0 0 10px rgba(0,0,0,0.2)', zIndex:1000, width:'400px', maxWidth:'90vw' }}>
          <h3>{mode==='new'?'New Booking':`Edit Booking #${editingBooking.id}`}</h3>
          <div style={{ display:'grid', gap:'10px' }}>
            <label>SailorId<br/><input value={form.sailorId} onChange={e=>setForm(f=>({...f,sailorId:e.target.value}))}/></label>
            <label>DockId<br/><input value={form.dockId} onChange={e=>setForm(f=>({...f,dockId:e.target.value}))}/></label>
            <label>DockingSpotId<br/><input value={form.dockingSpotId} onChange={e=>setForm(f=>({...f,dockingSpotId:e.target.value}))}/></label>
            <label>StartDate<br/><input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}/></label>
            <label>EndDate<br/><input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))}/></label>
            <label>People<br/><input type="number" value={form.people} onChange={e=>setForm(f=>({...f,people:e.target.value}))}/></label>
            <label>PaymentMethod<br/><input value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))}/></label>
          </div>
          <div style={{ marginTop:'10px' }}>
            <button onClick={handleSave}>{mode==='new'?'Create':'Save'}</button>
            <button onClick={()=>{setMode(null);setEditingBooking(null);resetForm();}} style={{ marginLeft:'10px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
