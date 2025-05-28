// src/pages/Guides.jsx
import React, { useEffect, useState } from 'react';
import {
  getGuides,
  addGuide,
  updateGuide,
  deleteGuide,
} from '../services/guideService';
import './styling/Users.css';   // for .user-table, .btn, etc.

export default function Guides() {
  const [guides, setGuides]         = useState([]);
  const [form, setForm]             = useState({
    title: '',
    content: '',
    authorID: '',
    createdOn: '',
  });
  const [editingID, setEditingID]   = useState(null);

  // Load guides once
  useEffect(() => {
    getGuides().then(setGuides);
  }, []);

  // Generic form field handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Add or update guide
  const handleSubmit = async () => {
    if (editingID) {
      await updateGuide(editingID, form);
      setGuides(gs =>
        gs.map(g => (g.guideID === editingID ? { ...g, ...form } : g))
      );
    } else {
      const { guideID } = await addGuide(form);
      const fresh = await getGuides();
      setGuides(fresh);
    }
    // reset form
    setForm({ title:'', content:'', authorID:'', publicationDate:'' });
    setEditingID(null);
  };

  // Delete
  const handleDelete = async id => {
    if (!window.confirm('Delete this guide?')) return;
    await deleteGuide(id);
    setGuides(gs => gs.filter(g => g.guideID !== id));
  };

  // Begin editing
  const handleEdit = g => {
    setEditingID(g.guideID);
    setForm({
      title: g.title,
      content: g.content,
      authorID: g.authorID.toString(),
      createdOn: g.createdOn.slice(0,10)
    });
  };

  return (
    <div style={{ padding: '40px 20px', background: 'transparent' }}>

      {/* ———————————————————————————————————————————— */}
      {/* ADD / EDIT GUIDE CARD */}
      {/* ———————————————————————————————————————————— */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 40px',
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>
          {editingID ? 'Edit Guide' : 'Add Guide'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Content"
            rows={4}
            value={form.content}
            onChange={handleChange}
          />
          <input
            name="authorID"
            placeholder="Author ID"
            value={form.authorID}
            onChange={handleChange}
          />
          <input
            name="publicationDate"
            type="date"
            placeholder="Publication Date"
            value={form.createdOn}
            onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            style={{ alignSelf: 'center' }}
          >
            {editingID ? 'Update Guide' : 'Add Guide'}
          </button>
        </div>
      </div>

      {/* ———————————————————————————————————————————— */}
      {/* GUIDES TABLE */}
      {/* ———————————————————————————————————————————— */}
      <div style={{ maxWidth: '90%', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Guides</h2>
        {guides.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No guides available</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Content</th>
                <th>Author</th>
                <th>Pub Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map(g => (
                <tr key={g.guideID}>
                  <td>{g.guideID}</td>
                  <td>{g.title}</td>
                  <td>{g.content}</td>
                  <td>{g.authorID}</td>
                  <td>{new Date(g.createdOn).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(g)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(g.guideID)}
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
      </div>

    </div>
  );
}
