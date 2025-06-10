// src/pages/GuideEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuide, updateGuide } from '../services/guideService';

export default function GuideEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title:     '',
    content:   '',
    authorID:  '',
    createdOn: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getGuide(id)
      .then(g => {
        setForm({
          title:     g.title,
          content:   g.content,
          authorID:  g.createdBy.toString(),
          createdOn: g.createdOn.slice(0, 10),
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load guide');
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      await updateGuide(id, {
        title:     form.title,
        content:   form.content,
        authorID:  +form.authorID,
        createdOn: form.createdOn,
      });
      navigate(`/guides/${id}`);
    } catch (e) {
      alert(e.message || 'Failed to save guide');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (error)   return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20, width: '90%' }}>
      <h2>Edit Guide #{id}</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          Title<br />
          <input
            style={{ width: '90%' }}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </label>

        <label>
          Author ID<br />
          <input
            type="number"
            style={{ width: '100px' }}
            value={form.authorID}
            onChange={e => setForm(f => ({ ...f, authorID: e.target.value }))}
          />
        </label>

        <label>
          Created On<br />
          <input
            type="date"
            style={{ width: '160px' }}
            value={form.createdOn}
            onChange={e => setForm(f => ({ ...f, createdOn: e.target.value }))}
          />
        </label>
        <label>
          Content (HTML)<br />
          <textarea
            rows={8}
            style={{ width: '100%' }}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          />
        </label>


      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-edit" onClick={handleSave}>
          Save
        </button>
        <button
          className="btn"
          style={{ marginLeft: 10 }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
