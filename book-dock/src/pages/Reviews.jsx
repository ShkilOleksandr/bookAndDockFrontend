// src/pages/Reviews.jsx
import React, { useEffect, useState } from 'react';
import { getReviews }        from '../services/reviewService';
import './styling/Users.css'; // reuse your table styles

export default function Reviews() {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getReviews()
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load reviews');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading reviews…</p>
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
      <h2 style={{ textAlign: 'center' }}>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>UserId</th>
              <th>Rating</th>
              <th>Content</th>
              <th>CreatedAt</th>
              <th>DockId</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.userId}</td>
                <td>{r.rating}</td>
                <td>{r.content}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>{r.dockId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
