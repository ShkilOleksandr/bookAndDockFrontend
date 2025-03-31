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
    setPosts(posts.filter(p => p.postID !== postID));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Posts</h2>

      <h4>Create & Approve Post</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} />
        <input name="authorID" placeholder="Author ID" value={form.authorID} onChange={handleChange} />
        <input name="publication_date" placeholder="Publication Date" type="date" value={form.publication_date} onChange={handleChange} />
        <button onClick={handleApprove}>Approve Post</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <h4>Approved Posts</h4>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author ID</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.postID}>
                <td>{post.title}</td>
                <td>{post.authorID}</td>
                <td>{post.publication_date}</td>
                <td>
                  <button onClick={() => handleDelete(post.postID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
