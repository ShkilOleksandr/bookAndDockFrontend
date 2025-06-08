// src/pages/Guides.jsx
import React, { useEffect, useState } from 'react';
import {
  getGuides,
  addGuide,
  updateGuide,
  deleteGuide,
} from '../services/guideService';
import './styling/Users.css'; // reuse your .user-table, .btn, etc.

export default function Guides() {
  const [guides, setGuides]       = useState([]);
  const [editingGuide, setEditingGuide] = useState(null); 
  const [mode, setMode]           = useState(null); // 'new' or 'edit'
  const [form, setForm] = useState({
    title:     '',
    content:   '',
    authorID:  '',
    createdOn: '', // YYYY-MM-DD
  });

  // sort alphabetically by title
  const sortByTitle = (a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });

  useEffect(() => {
    getGuides()
      .then(data => {
        if (Array.isArray(data)) {
          setGuides(data.slice().sort(sortByTitle));
        } else {
          console.error('Expected array, got:', data);
        }
      })
      .catch(err => {
        console.error('Failed to load guides:', err);
        setGuides([]);
      });
  }, []);

  const onNewClick = () => {
    setMode('new');
    setEditingGuide(null);
    setForm({ title: '', content: '', authorID: '', createdOn: '' });
  };

  const handleEditClick = g => {
    setMode('edit');
    setEditingGuide(g);
    setForm({
      title:     g.title,
      content:   g.content,
      authorID:  g.createdBy.toString(),
      createdOn: g.createdOn.slice(0, 10),
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this guide?')) return;
    try {
      await deleteGuide(id);
      setGuides(gs => gs.filter(g => g.guideID !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete guide');
    }
  };

  const handleSave = async () => {
    const payload = {
      title:     form.title,
      content:   form.content,
      authorID:  +form.authorID,
      createdOn: form.createdOn,
    };

    try {
      if (mode === 'new') {
        const created = await addGuide(payload);
        setGuides(gs => [...gs, created].sort(sortByTitle));
      } else {
        await updateGuide(editingGuide.guideID, payload);
        setGuides(gs =>
          gs
            .map(g =>
              g.guideID === editingGuide.guideID
                ? { ...g, ...payload }
                : g
            )
            .sort(sortByTitle)
        );
      }
      setMode(null);
      setEditingGuide(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save guide');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Guides</h2>

      <button className="btn btn-new" onClick={onNewClick}>
        + Add Guide
      </button>

      {guides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Content</th>
              <th>AuthorID</th>
              <th>CreatedOn</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map(g => (
              <tr key={g.guideID}>
                <td>{g.guideID}</td>
                <td>{g.title}</td>
                <td>{g.content}</td>
                <td>{g.createdBy}</td>
                <td>{new Date(g.createdOn).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditClick(g)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(g.guideID)}
                    style={{ marginLeft: '10px' }}
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
          width: '400px',
          maxWidth: '90vw',
        }}>
          <h3>{mode === 'new' ? 'New Guide' : `Edit Guide #${editingGuide.guideID}`}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label>
              Title<br/>
              <input
                name="title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label>
              Content<br/>
              <textarea
                name="content"
                rows={4}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              />
            </label>
            <label>
              Author ID<br/>
              <input
                name="authorID"
                type="number"
                value={form.authorID}
                onChange={e => setForm(f => ({ ...f, authorID: e.target.value }))}
              />
            </label>
            <label>
              Created On<br/>
              <input
                name="createdOn"
                type="date"
                value={form.createdOn}
                onChange={e => setForm(f => ({ ...f, createdOn: e.target.value }))}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>
              {mode === 'new' ? 'Create' : 'Save'}
            </button>
            <button onClick={() => { setMode(null); setEditingGuide(null); }} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
