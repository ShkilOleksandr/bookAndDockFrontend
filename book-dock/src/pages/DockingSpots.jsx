// src/pages/DockingSpots.jsx
import React, { useEffect, useState } from 'react';
import './styling/Users.css';   // re-use your table styles

// === DUMMY DATA ===
const dummySpots = [
  {
    id:  1,
    name: "Sunset Dock",
    description: "Perfect for catching the sunset. Includes water & power hookup.",
    ownerId:         3,
    portId:          1,
    pricePerNight:   150,
    pricePerPerson:  20,
    isAvailable:     true,
    createdOn:       "2025-03-23T02:46:05.359Z",
  },
  {
    id:  2,
    name: "Budget Bay",
    description: "Affordable dock close to shore with basic facilities.",
    ownerId:         3,
    portId:          1,
    pricePerNight:   80,
    pricePerPerson:  10,
    isAvailable:     true,
    createdOn:       "2025-03-23T02:46:05.359Z",
  },
  {
    id:  3,
    name: "Main Marina Spot",
    description: "Centrally located dock with easy town access.",
    ownerId:         3,
    portId:          2,
    pricePerNight:   200,
    pricePerPerson:  25,
    isAvailable:     true,
    createdOn:       "2025-03-23T02:46:05.359Z",
  },
  {
    id:  4,
    name: "Quiet Corner",
    description: "Private spot away from the crowd, surrounded by trees.",
    ownerId:         3,
    portId:          2,
    pricePerNight:   120,
    pricePerPerson:  15,
    isAvailable:     false,
    createdOn:       "2025-03-23T02:46:05.359Z",
  },
  // …add as many as you like…
];

export default function DockingSpots() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    // temporarily use dummy data 
    setSpots(dummySpots);

    // when your backend is ready, replace with:
    // getDockingSpots().then(data => setSpots(data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Docking Spots</h2>
      {spots.length === 0 ? (
        <p>No docking spots found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>OwnerId</th>
              <th>PortId</th>
              <th>Price/Night</th>
              <th>Price/Person</th>
              <th>Available?</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {spots.map(spot => (
              <tr key={spot.id}>
                <td>{spot.id}</td>
                <td>{spot.name}</td>
                <td>{spot.description}</td>
                <td>{spot.ownerId}</td>
                <td>{spot.portId}</td>
                <td>${spot.pricePerNight}</td>
                <td>${spot.pricePerPerson}</td>
                <td>{spot.isAvailable ? 'Yes' : 'No'}</td>
                <td>{new Date(spot.createdOn).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
