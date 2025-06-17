// src/pages/GuideDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
      <div style={{ padding: 20 }}>
        <button onClick={() => navigate('/guides')}>← Back</button>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  if (!guide) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => navigate('/guides')}>← Back</button>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate('/guides')}>← Back to Guides</button>
      <button
        className="btn btn-edit"
        style={{ marginLeft: 10 }}
        onClick={() => navigate(`/guides/${id}/edit`)}
      >
        Edit
      </button>

      <h1 style={{ marginTop: 20 }}>{guide.title}</h1>
      <p>
        <em>
          By user #{guide.createdBy} on{' '}
          {new Date(guide.createdOn).toLocaleDateString()}
        </em>
      </p>
      <div
        style={{ marginTop: 20 }}
        dangerouslySetInnerHTML={{ __html: guide.content }}
      />
    </div>
  );
}
