import React, { useEffect, useState } from 'react';
import {
  addGuide,
  updateGuide,
  deleteGuide,
  addCommentToGuide,
} from '../services/guideService';

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    authorID: '',
    publicationDate: '',
    pictures: [],
    links: [],
  });
  const [editingID, setEditingID] = useState(null);
  const [commentForm, setCommentForm] = useState({ userID: '', content: '' });

  useEffect(() => {
    // Since we're mocking, fetch is skipped; we assume initial data is already loaded from handlers
    fetch('/guides')
      .then(res => res.json())
      .then(data => setGuides(data));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (editingID) {
      const res = await updateGuide(editingID, form);
      console.log(res.message);
      setGuides(guides.map(g => (g.guideID === editingID ? { ...g, ...form } : g)));
    } else {
      const res = await addGuide(form);
      setGuides([...guides, { ...form, guideID: res.guideID }]);
    }

    setForm({
      title: '',
      content: '',
      authorID: '',
      publicationDate: '',
      pictures: [],
      links: [],
    });
    setEditingID(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this guide?');
    if (!confirm) return;

    const res = await deleteGuide(id);
    console.log(res.message);
    setGuides(guides.filter(g => g.guideID !== id));
  };

  const handleEdit = (guide) => {
    setEditingID(guide.guideID);
    setForm({
      title: guide.title,
      content: guide.content,
      authorID: guide.authorID,
      publicationDate: guide.publicationDate,
      pictures: guide.pictures,
      links: guide.links,
    });
  };

  const handleCommentSubmit = async (guideID) => {
    const res = await addCommentToGuide(guideID, commentForm.userID, commentForm.content);
    alert(res.message);
    setCommentForm({ userID: '', content: '' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingID ? 'Edit Guide' : 'Add Guide'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '500px' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} />
        <input name="authorID" placeholder="Author ID" value={form.authorID} onChange={handleChange} />
        <input name="publicationDate" type="date" placeholder="Publication Date" value={form.publicationDate} onChange={handleChange} />
        <button onClick={handleSubmit}>{editingID ? 'Update' : 'Add'} Guide</button>
      </div>

      <h3>Guides</h3>
      {guides.length === 0 ? (
        <p>No guides available</p>
      ) : (
        <ul>
          {guides.map(guide => (
            <li key={guide.guideID} style={{ marginBottom: '20px' }}>
              <strong>{guide.title}</strong> (Author ID: {guide.authorID})  
              <br />
              {guide.content}
              <br />
              <small>Published: {guide.publicationDate}</small>
              <br />
              <button onClick={() => handleEdit(guide)}>Edit</button>
              <button onClick={() => handleDelete(guide.guideID)} style={{ marginLeft: '10px' }}>
                Delete
              </button>

              <div style={{ marginTop: '10px' }}>
                <input
                  placeholder="User ID"
                  value={commentForm.userID}
                  onChange={(e) => setCommentForm({ ...commentForm, userID: e.target.value })}
                />
                <input
                  placeholder="Comment"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                />
                <button onClick={() => handleCommentSubmit(guide.guideID)}>Add Comment</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
