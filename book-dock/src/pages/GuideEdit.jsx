import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuide, updateGuide } from '../services/guideService';
import axios from 'axios';

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
  const [images, setImages] = useState([]);      // ← our image menu
  const [showPicker, setShowPicker] = useState(false);
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

  // Fetch your images once when the picker is first opened
  const loadImages = async () => {
    if (images.length) return;
    try {
      const { data } = await axios.get('/api/Image'); // adjust as needed
      // assume data is an array of { id, url } or similar
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
    const imgTag = `<img src="${url}" />`;
    const newContent = before + imgTag + after;

    setForm(f => ({ ...f, content: newContent }));
    setShowPicker(false);

    // after React updates DOM, put cursor after the new tag:
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

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (error)   return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20, width: '90%' }}>
      <h2>Edit Guide #{id}</h2>
      {/* … other fields … */}
      <label>
        Content (HTML)<br/>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={8}
            style={{ width: '100%' }}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          />
          <button
            type="button"
            onClick={openPicker}
            style={{
              position: 'absolute',
              top: 4, right: 4,
              padding: '4px 8px',
              fontSize: 12
            }}
          >
            + Image
          </button>
        </div>
      </label>

      {showPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: '50px', right: '20px',
            background: 'white',
            border: '1px solid #ccc',
            padding: 12,
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <h4>Select an image</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 80px)',
              gap: 8
            }}
          >
            {images.map(img => (
              <img
                key={img.id}
                src={img.url}
                alt=""
                style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => insertImage(img.url)}
              />
            ))}
          </div>
          <button onClick={() => setShowPicker(false)} style={{ marginTop: 8 }}>
            Close
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-edit" onClick={handleSave}>Save</button>
        <button className="btn" onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
