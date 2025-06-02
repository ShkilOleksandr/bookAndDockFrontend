// src/pages/Reviews.jsx
import React, { useEffect, useState } from 'react';
import {
  getReviews,
  updateReview,
  deleteReview
} from '../services/reviewService';
import './styling/Users.css'; // reuse your table styles (e.g. .user-table, .btn)

export default function Reviews() {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // For editing:
  const [editingReview, setEditingReview] = useState(null);
  const [form, setForm] = useState({
    rating: '',
    content: ''
  });

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

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?'
    );
    if (!confirmDelete) return;

    const result = await deleteReview(reviewId);
    if (result.error) {
      alert('Error deleting review: ' + result.error);
      return;
    }
    // Remove from local state
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setForm({
      rating: review.rating,
      content: review.content
    });
  };

  const handleUpdate = async () => {
    if (!editingReview) return;
    const updatedData = {
      rating: form.rating,
      content: form.content
    };

    const result = await updateReview(editingReview.id, updatedData);
    if (result.error) {
      alert('Error updating review: ' + result.error);
      return;
    }

    // Update local state: merge updated fields into the matching review
    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? { ...r, rating: form.rating, content: form.content }
          : r
      )
    );
    setEditingReview(null);
  };

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
              <th>Actions</th>
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
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditClick(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(r.id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal / Floating Form */}
      {editingReview && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            padding: '20px',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <h3>Edit Review (ID: {editingReview.id})</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Rating: </label>
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: e.target.value }))
              }
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Content: </label>
            <textarea
              rows="3"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUpdate}>Save</button>
            <button
              onClick={() => setEditingReview(null)}
              style={{ marginLeft: '8px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
