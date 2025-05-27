// src/pages/Reviews.jsx
import React, { useEffect, useState } from 'react';
import { getReviews }        from '../services/reviewService';
import './styling/Users.css'; // reuse your table styles

// ——— dummy data until your backend is live ———
const dummyReviews = [
  {
    id: 1,
    createdBy:    1,
    rating:       5,
    comment:      "Zbs",
    createdOn:    "2025-03-23T03:09:03.551Z",
    portId:       1,
  },
  {
    id: 2,
    createdBy:    2,
    rating:       1,
    comment:      "Gówno, nie polecam",
    createdOn:    "2025-03-23T03:09:03.551Z",
    portId:       2,
  },
  {
    id: 3,
    createdBy:    3,
    rating:       4,
    comment:      "Nice facilities, could be cleaner.",
    createdOn:    "2025-03-23T03:40:18.451Z",
    portId:       3,
  },
  {
    id: 4,
    createdBy:    4,
    rating:       5,
    comment:      "Amazing views and quiet nights.",
    createdOn:    "2025-03-23T03:40:18.451Z",
    portId:       4,
  },
  {
    id: 5,
    createdBy:    5,
    rating:       3,
    comment:      "Pretty average.",
    createdOn:    "2025-03-23T03:40:18.451Z",
    portId:       2,
  },
  // …add more as needed…
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // temporary dummy data:
    setReviews(dummyReviews);

    // when ready, swap in real API:
    // getReviews().then(data => setReviews(data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>CreatedBy</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>CreatedOn</th>
              <th>PortId</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.createdBy}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>{new Date(r.createdOn).toLocaleString()}</td>
                <td>{r.portId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
