import React, { useState, useEffect } from 'react';
import musicData from '../data/musicData.json';

const Artists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    setArtists(musicData.artists);
  }, []);

  return (
    <div>
      <h1>Featured Artists</h1>
      <div className="artist-cards">
        {artists.map(artist => (
          <div key={artist.id} className="artist">
            <img src={artist.image} alt={artist.name} />
            <h3>{artist.name}</h3>
            <p>Genre: {artist.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artists;