import React, { useState, useEffect } from 'react';
import { approvePost, deletePost, getPosts } from '../services/postService';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    authorID: '',
    publication_date: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts().then(data => {
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Expected array, got:', data);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApprove = async () => {
    setError('');
    const result = await approvePost(form);

    if (result.message === 'Post approved') {
      setPosts(prev => [...prev, { ...form, postID: Date.now() }]);
      setForm({ title: '', content: '', authorID: '', publication_date: '' });
    } else {
      setError(`${result.message}: ${result.reason}`);
    }
  };

  const handleDelete = async (postID) => {
    await deletePost(postID);
    setPosts(prev => prev.filter(p => p.postID !== postID));
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      padding: '40px 20px',
      backgroundColor: 'transparent',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ textAlign: 'center' }}>Posts</h2>

        <h4 style={{ marginTop: '20px' }}>Create & Approve Post</h4>
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
            name="publication_date"
            type="date"
            placeholder="Publication Date"
            value={form.publication_date}
            onChange={handleChange}
          />
          <button onClick={handleApprove} style={{ alignSelf: 'center' }}>
            Approve Post
          </button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </div>

        <h4 style={{ marginTop: '30px', textAlign: 'center' }}>Approved Posts</h4>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No posts yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Author ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.postID}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.authorID}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.publication_date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(post.postID)}>Delete</button>
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