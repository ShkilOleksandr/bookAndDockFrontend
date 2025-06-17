// src/pages/Comments.jsx
import React, { useEffect, useState } from 'react';
import {
  getComments,
  updateComment,
  deleteComment,
} from '../services/commentService';
import './styling/Users.css'; 

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [editingComment, setEditingComment] = useState(null);
  const [form, setForm] = useState({
    content: '',
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    getComments()
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load comments');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment?'
    );
    if (!confirmDelete) return;

    const result = await deleteComment(commentId);
    if (result.error) {
      alert('Error deleting comment: ' + result.error);
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setForm({
      content: comment.content,
    });
  };

 const handleUpdate = async () => {
   if (!editingComment) return;
   const updatedDto = {
     id:        editingComment.id,
     createdBy: editingComment.createdBy,
     guideId:   editingComment.guideId,
     content:   form.content,
     createdOn: editingComment.createdOn,    
   };

   const result = await updateComment(updatedDto);
    if (result.error) {
      alert('Error updating comment: ' + result.error);
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === editingComment.id
          ? { ...c, content: form.content }
          : c
      )
    );
    setEditingComment(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading comments…</p>
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
      <h2 style={{ textAlign: 'center' }}>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>CreatedBy</th>
              <th>GuideId</th>
              <th>Content</th>
              <th>CreatedOn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.createdBy}</td>
                <td>{c.guideId}</td>
                <td>{c.content}</td>
                <td>{new Date(c.createdOn).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditClick(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(c.id)}
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

      {editingComment && (
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
          <h3>Edit Comment (ID: {editingComment.id})</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Content:</label>
            <textarea
              rows="3"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUpdate}>Save</button>
            <button
              onClick={() => setEditingComment(null)}
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
