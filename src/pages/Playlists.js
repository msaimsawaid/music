import React, { useState, useEffect } from 'react';
import musicData from '../data/musicData.json';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    setPlaylists(musicData.featuredPlaylists);
  }, []);

  return (
    <div>
      <h1>Playlists</h1>
      <div className="cards">
        {playlists.map(playlist => (
          <div key={playlist.id} className="card">
            <img src={playlist.image} alt={playlist.title} />
            <h3>{playlist.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;