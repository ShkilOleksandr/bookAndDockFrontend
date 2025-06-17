// src/pages/GuideEdit.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuide, updateGuide } from '../services/guideService';
import { getImages, getImageUrl } from '../services/imageService';
import './styling/Users.css'; // for basic button/table styles

export default function GuideEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [form, setForm] = useState({
    title:     '',
    content:   '',
    authorID:  '',
    createdOn: '',
  });
  const [images, setImages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // load guide data
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

  // fetch images once when opening picker
  const loadImages = async () => {
    if (images.length) return;
    try {
      const data = await getImages();
      setImages(data);
    } catch (e) {
      console.error('Couldn’t load images', e);
    }
  };

  const openPicker = () => {
    setShowPicker(true);
    loadImages();
  };

  const insertImage = url => {
    const ta = textareaRef.current;
    const { selectionStart, selectionEnd } = ta;
    const before = form.content.slice(0, selectionStart);
    const after  = form.content.slice(selectionEnd);
    const imgTag = `<img src=\"${url}\" style=\"max-width:100%;margin:8px 0;\"/>`;
    const newContent = before + imgTag + after;

    setForm(f => ({ ...f, content: newContent }));
    setShowPicker(false);
    requestAnimationFrame(() => {
      const pos = before.length + imgTag.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

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

  if (loading) return <div style={{ padding: 20, fontStyle: 'italic' }}>Loading…</div>;
  if (error)   return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', background: '#f9f9f9', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16, textAlign: 'center', color: '#333' }}>Edit Guide #{id}</h2>

      {/* Content Field */}
      <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: '#555' }}>
        Content (HTML)
      </label>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <textarea
          ref={textareaRef}
          rows={8}
          style={{
            width: '100%',
            padding: 8,
            fontSize: 14,
            lineHeight: 1.5,
            border: '1px solid #ccc',
            borderRadius: 4,
            resize: 'vertical',
          }}
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
        />
        <button
          type="button"
          onClick={openPicker}
          className="btn btn-primary"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '6px 10px',
            fontSize: 12,
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          + Image
        </button>
      </div>

      {showPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: '200px',
            right: '20px',
            width: 360,
            background: '#fff',
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h4 style={{ margin: '0 0 12px', fontSize: 16, color: '#333' }}>Select an image</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 80px)',
              gap: 8,
              maxHeight: 240,
              overflowY: 'auto',
              paddingBottom: 8,
            }}
          >
            {images.map(img => (
              <img
                key={img.id}
                src={getImageUrl(img.id)}
                alt={`Image ${img.id}`}
                style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer', borderRadius: 4 }}
                onClick={() => insertImage(getImageUrl(img.id))}
              />
            ))}
          </div>
          <button
            className="btn"
            onClick={() => setShowPicker(false)}
            style={{
              marginTop: 12,
              padding: '6px 12px',
              fontSize: 14,
              background: '#e0e0e0',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          className="btn btn-edit"
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginRight: 8,
          }}
        >
          Save
        </button>
        <button
          className="btn"
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            background: '#ccc',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
