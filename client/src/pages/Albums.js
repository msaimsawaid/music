import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Album.css';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const { user } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await api.get('/albums');
      setAlbums(response.data.data.albums);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.innerHTML = '💿';
    e.target.parentNode.appendChild(placeholder);
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setGenre('');
    setCoverImage(null);
    setIsEditing(false);
    setCurrentAlbumId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (album) => {
    setTitle(album.title);
    setArtist(album.artist);
    setGenre(album.genre);
    setCurrentAlbumId(album._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    try {
      await api.delete(`/albums/${id}`);
      fetchAlbums();
    } catch (err) {
      console.error('Error deleting album:', err);
      alert('Failed to delete album');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('genre', genre);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      if (isEditing) {
        await api.patch(`/albums/${currentAlbumId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/albums', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      resetForm();
      fetchAlbums();
    } catch (err) {
      console.error('Error saving album:', err);
      alert('Failed to save album');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/${imagePath}`;
  };

  if (loading) return <div className="loading">Loading albums...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="albums-page">
      <div className="albums-header">
        <h1>Albums Collection</h1>
        {user && (
          <button className="btn-add" onClick={openCreateModal}>
            + Add Album
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Edit Album' : 'Add New Album'}</h2>
            <form onSubmit={handleSubmit}>
              {/* Form fields same as before */}
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <input value={artist} onChange={(e) => setArtist(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input value={genre} onChange={(e) => setGenre(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cover Image</label>
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">{isEditing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="album-list">
        {albums.length === 0 ? (
          <p>No albums found. Add one!</p>
        ) : (
          albums.map(album => (
            <div key={album._id} className="album-card">
              <div className="album-image-container">
                {album.coverImage ? (
                  <img
                    src={getImageUrl(album.coverImage)}
                    alt={album.title}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="placeholder-image">💿</div>
                )}
              </div>
              <h3>{album.title}</h3>
              <p>{album.artist}</p>
              <p className="album-meta">{album.genre} • {new Date(album.releaseDate).getFullYear()}</p>

              {/* Edit/Delete Actions */}
              {user && (user._id === album.createdBy || user._id === album.createdBy._id || user.role === 'admin') && (
                <div className="album-actions">
                  <button onClick={() => openEditModal(album)} className="btn-action edit">Edit</button>
                  <button onClick={() => handleDelete(album._id)} className="btn-action delete">Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Albums;