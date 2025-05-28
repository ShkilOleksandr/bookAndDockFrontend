import React, { useEffect, useState } from 'react';
import {
  getBookings,
  updateBooking,
  deleteBooking
} from '../services/bookingService';
import './styling/Users.css';   // reuse your existing table styles

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    sailorId: '',
    dockingSpotId: '',
    startDate: '',
    endDate: '',
    paymentMethodId: '',
    isPaid: false,
    people: ''
  });

  useEffect(() => {
    getBookings().then(setBookings);
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await deleteBooking(id);
    setBookings(bs => bs.filter(b => b.id !== id));
  };

  const onEditClick = (b) => {
    setEditing(b);
    setForm({
      sailorId: b.sailorId,
      dockingSpotId: b.dockingSpotId,
      startDate: b.startDate,
      endDate: b.endDate,
      paymentMethodId: b.paymentMethodId,
      isPaid: b.isPaid,
      people: b.people
    });
  };

  const onSave = async () => {
    const payload = {
      sailorId: +form.sailorId,
      dockingSpotId: +form.dockingSpotId,
      startDate: form.startDate,
      endDate: form.endDate,
      paymentMethodId: +form.paymentMethodId,
      isPaid: form.isPaid,
      people: +form.people
    };
    await updateBooking(editing.id, payload);
    setBookings(bs =>
      bs.map(b => (b.id === editing.id ? { ...b, ...payload } : b))
    );
    setEditing(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Bookings</h2>

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
              <th>PaymentMethodId</th>
              <th>Paid?</th>
              <th>People</th>
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
                <td>{b.paymentMethodId}</td>
                <td>{b.isPaid ? 'Yes' : 'No'}</td>
                <td>{b.people}</td>
                <td>{new Date(b.createdOn).toLocaleString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEditClick(b)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => onDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
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

          width: '400px',        // fix the width
          maxWidth: '90vw',      // or constrain to viewport
          marginTop: '20px', // add some margin from the top
        }}>
            <div className="modal-content">
              <div>
            <h3>Edit Booking #{editing.id}</h3>
            </div>
            <div>
            <label>SailorId</label>
            <input
              type="number"
              value={form.sailorId}
              onChange={e => setForm(f => ({ ...f, sailorId: e.target.value }))}
            />
            </div>
            <div>
            <label>DockingSpotId</label>
            <input
              type="number"
              value={form.dockingSpotId}
              onChange={e => setForm(f => ({ ...f, dockingSpotId: e.target.value }))}
            />
            </div>
            <div>         
            <label>StartDate</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />
            </div>
            <div>
            <label>EndDate</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            />
            </div>
            <div>
            <label>PaymentMethodId</label>
            <input
              type="number"
              value={form.paymentMethodId}
              onChange={e => setForm(f => ({ ...f, paymentMethodId: e.target.value }))}
            />
            </div>
            <div>
            <label>Paid?</label>
            <input
              type="checkbox"
              checked={form.isPaid}
              onChange={e => setForm(f => ({ ...f, isPaid: e.target.checked }))}
            />
            </div>
            <div>
            <label>People</label>
            <input
              type="number"
              value={form.people}
              onChange={e => setForm(f => ({ ...f, people: e.target.value }))}
            />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={onSave}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}
