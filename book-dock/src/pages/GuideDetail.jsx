// src/pages/GuideDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styling/Users.css'; 

const BASE_URL = 'https://se2.lemonfield-889f35af.germanywestcentral.azurecontainerapps.io';

export default function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    fetch(`${BASE_URL}/api/Guide/${id}`, { headers })
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t || `Failed to load guide ${id}`); });
        return res.json();
      })
      .then(setGuide)
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', color: '#c00' }}>
        <button
          onClick={() => navigate('/guides')}
          className="btn"
          style={{ marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', fontStyle: 'italic', color: '#555' }}>
        <button
          onClick={() => navigate('/guides')}
          className="btn"
          style={{ marginBottom: 16 }}
        >
          ← Back
        </button>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => navigate('/guides')}
            className="btn"
            style={{ marginRight: 8 }}
          >
            ← Back to Guides
          </button>
          <button
            className="btn btn-edit"
            onClick={() => navigate(`/guides/${id}/edit`)}
          >
            Edit
          </button>
        </div>
      </div>

      <h1 style={{ marginTop: 20, fontSize: 28, color: '#333' }}>{guide.title}</h1>
      <p style={{ margin: '8px 0', color: '#666', fontStyle: 'italic' }}>
        By user #{guide.createdBy} on {new Date(guide.createdOn).toLocaleDateString()}
      </p>

      <div
        style={{ marginTop: 16, lineHeight: 1.6, color: '#444' }}
        dangerouslySetInnerHTML={{ __html: guide.content }}
      />
    </div>
  );
}
