// src/pages/Bookings.jsx
import React, { useEffect, useState } from 'react';
import {
  getBookings,
  updateBooking,
  deleteBooking,
  createBooking
} from '../services/bookingService';
import './styling/Users.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing]   = useState(null);
  const [mode, setMode]         = useState(null); // 'new' | 'edit' | null
  const [form, setForm] = useState({
    sailorId:        '',
    dockingSpotId:   '',
    // If your API actually expects "dockId" too, add it here:
    dockId:          '',
    startDate:       '',
    endDate:         '',
    people:          '',
    // If your API expects a free-text payment string, use this:
    payment:         '',
    // If instead your API really wants a numeric paymentMethodId, rename above field:
    // paymentMethodId: '',
    // If you also support toggling "isPaid" on update, uncomment:
    // isPaid:        false,
  });

  // Load on mount
  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch(err => {
        console.error('Failed to load bookings:', err);
        setBookings([]);
      });
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteBooking(id);
      setBookings(bs => bs.filter(b => b.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete booking');
    }
  };

  const onEditClick = (b) => {
    setMode('edit');
    setEditing(b);
    setForm({
      sailorId:      b.sailorId,
      dockingSpotId: b.dockingSpotId,
      dockId:        b.dockId ?? '',        // adjust if your GET returns a different name
      startDate:     b.startDate.slice(0,10),
      endDate:       b.endDate.slice(0,10),
      people:        b.people,
      payment:       b.payment   || '',     // or b.paymentMethodId
      // isPaid:     b.isPaid,      // if you support paid-flag
    });
  };

  const onNewClick = () => {
    setMode('new');
    setEditing(null);
    setForm({
      sailorId:      '',
      dockingSpotId: '',
      dockId:        '',
      startDate:     '',
      endDate:       '',
      people:        '',
      payment:       '',
      // isPaid:     false,
    });
  };

  const onSave = async () => {
    // Build your payload exactly as your API expects:
    const payload = {
      sailorId:      +form.sailorId,
      dockingSpotId: +form.dockingSpotId,
      // If your create DTO wants dockId:
      dockId:        +form.dockId,
      startDate:     form.startDate,
      endDate:       form.endDate,
      people:        +form.people,
      payment:       form.payment,           // or paymentMethodId: +form.paymentMethodId
      // isPaid:     form.isPaid,             // only if your API supports it
    };

    try {
      if (mode === 'new') {
        // CREATE
        const created = await createBooking(payload);
        setBookings(bs => [...bs, created]);
      } else {
        // EDIT
        await updateBooking(editing.id, payload);
        setBookings(bs =>
          bs.map(b => (b.id === editing.id ? { ...b, ...payload } : b))
        );
      }
      setMode(null);
      setEditing(null);
    } catch (err) {
      // our createBooking / updateBooking helpers throw with the server's error text
      alert(err.message || 'Failed to save booking');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Bookings</h2>

      <button
        className="btn btn-new"
        style={{ marginBottom: 10 }}
        onClick={onNewClick}
      >
        + Add Booking
      </button>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>SailorId</th>
              <th>DockingSpotId</th>
              <th>StartDate</th>
              <th>EndDate</th>
              <th>People</th>
              <th>Payment</th>
              {/* <th>Paid?</th> */}
              <th>CreatedOn</th>
              <th>Actions</th>
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
                <td>{b.payment}</td>
                {/* <td>{b.isPaid ? 'Yes' : 'No'}</td> */}
                <td>{new Date(b.createdOn).toLocaleString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEditClick(b)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    style={{ marginLeft: 8 }}
                    onClick={() => onDelete(b.id)}
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
            top:  '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            padding: 20,
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '400px',
            maxWidth: '90vw'
          }}
        >
          <h3>{mode === 'new' ? 'New Booking' : `Edit Booking #${editing.id}`}</h3>

          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              SailorId
              <input
                type="number"
                value={form.sailorId}
                onChange={e => setForm(f => ({ ...f, sailorId: e.target.value }))}
              />
            </label>

            {/* only if you need a separate DockId */}
            <label>
              DockId
              <input
                type="number"
                value={form.dockId}
                onChange={e => setForm(f => ({ ...f, dockId: e.target.value }))}
              />
            </label>

            <label>
              DockingSpotId
              <input
                type="number"
                value={form.dockingSpotId}
                onChange={e => setForm(f => ({ ...f, dockingSpotId: e.target.value }))}
              />
            </label>

            <label>
              StartDate
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              />
            </label>

            <label>
              EndDate
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
              />
            </label>

            <label>
              People
              <input
                type="number"
                value={form.people}
                onChange={e => setForm(f => ({ ...f, people: e.target.value }))}
              />
            </label>

            <label>
              Payment
              <input
                type="text"
                value={form.payment}
                onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}
              />
            </label>

            {/* if you support a paid checkbox on edit:
            <label>
              Paid?
              <input
                type="checkbox"
                checked={form.isPaid}
                onChange={e => setForm(f => ({ ...f, isPaid: e.target.checked }))}
              />
            </label>
            */}
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={onSave}>
              {mode === 'new' ? 'Create' : 'Save'}
            </button>
            <button
              onClick={() => {
                setMode(null);
                setEditing(null);
              }}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
