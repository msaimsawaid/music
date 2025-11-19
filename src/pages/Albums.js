import React, { useState, useEffect } from 'react';
import musicData from '../data/musicData.json';

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    setAlbums(musicData.newReleases);
  }, []);

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.innerHTML = '💿';
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    e.target.parentNode.appendChild(placeholder);
  };

  return (
    <div>
      <h1>Albums</h1>
      <div className="album-list">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <img 
              src={album.image} 
              alt={album.title}
              onError={handleImageError}
            />
            <h3>{album.title}</h3>
            <p>{album.artist} — {album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Albums;