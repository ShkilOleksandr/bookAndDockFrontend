// src/pages/Ports.jsx
import React, { useEffect, useState } from 'react';
import { getPorts } from '../services/portService';
import './styling/Users.css';   // reuse your table CSS

// === DUMMY DATA ===
const dummyPorts = [
  {
    id: 1,
    createdOn:     '2025-03-23T02:40:57.901Z',
    name:          'Bogaczewo',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 2,
    createdOn:     '2025-03-23T02:40:57.901Z',
    name:          'Gizycko',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 3,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Zloty Port',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 4,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Kamienna',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 5,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Nowy Harbor',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 6,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Laguna',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 7,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Szczecinek Marina',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
  {
    id: 8,
    createdOn:     '2025-03-23T03:36:33.736Z',
    name:          'Hidden Dock',
    description:   null,
    ownerId:       3,
    isApproved:    true,
  },
];

export default function Ports() {
  const [ports, setPorts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // temporarily use dummy data
    setPorts(dummyPorts);
    setLoading(false);

    // later, switch to real call:
    // getPorts()
    //   .then(data => setPorts(data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading ports…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

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
