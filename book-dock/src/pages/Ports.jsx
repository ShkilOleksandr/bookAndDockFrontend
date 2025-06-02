// src/pages/Ports.jsx
import React, { useEffect, useState } from 'react';
import { getPorts }           from '../services/portService';
import './styling/Users.css';   // reuse your table CSS

export default function Ports() {
  const [ports, setPorts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPorts()
      .then(data => {
        setPorts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load ports');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading ports…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Ports</h2>

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
            </tr>
          </thead>
          <tbody>
            {ports.map(port => (
              <tr key={port.id}>
                <td>{port.id}</td>
                <td>{new Date(port.createdOn).toLocaleString()}</td>
                <td>{port.name}</td>
                <td>{port.description || '—'}</td>
                <td>{port.ownerId}</td>
                <td>{port.isApproved ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
