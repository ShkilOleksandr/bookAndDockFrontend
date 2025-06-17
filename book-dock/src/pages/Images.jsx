/* src/pages/Images.jsx */
import React, { useEffect, useState } from 'react';
import {
  getImages,
  getImageUrl,
  deleteImage,
  uploadImage,
} from '../services/imageService';
import './styling/Users.css';

export default function Images() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [guideId, setGuideId] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    setLoading(true);
    setError(null);
    getImages()
      .then((data) => setImages(data))
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load images');
      })
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    if (!guideId) {
      alert('Please enter a Guide ID.');
      return;
    }
    if (!creatorId) {
      alert('Please enter a Creator ID.');
      return;
    }
    setUploading(true);
    try {
      const newImage = await uploadImage(file, creatorId, guideId);
      setImages((prev) => [newImage, ...prev]);
      setFile(null);
      setGuideId('');
      setCreatorId('');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this image?'
    );
    if (!confirmDelete) return;

    const result = await deleteImage(id);
    if (result.error) {
      alert('Error deleting image: ' + result.error);
      return;
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading images…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Images</h2>

      {/* Upload Section */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <input
          type="text"
          placeholder="Guide ID"
          value={guideId}
          onChange={(e) => setGuideId(e.target.value)}
          disabled={uploading}
          style={{ marginLeft: '8px', padding: '4px' }}
        />
        <input
          type="text"
          placeholder="Creator ID"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          disabled={uploading}
          style={{ marginLeft: '8px', padding: '4px' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={uploading || !file || !guideId || !creatorId}
          style={{ marginLeft: '8px' }}
        >
          {uploading ? 'Uploading…' : 'Add New Image'}
        </button>
      </div>

      {images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Preview</th>
              <th>Created At</th>
              <th>Creator ID</th>
              <th>Guide ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>
                  <img
                    src={getImageUrl(img.id)}
                    alt={`Image ${img.id}`}
                    style={{ maxWidth: 100, maxHeight: 100 }}
                  />
                </td>
                <td>{new Date(img.createdAt).toLocaleString()}</td>
                <td>{img.creatorId}</td>
                <td>{img.guideId}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(img.id)}
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
  );
}
