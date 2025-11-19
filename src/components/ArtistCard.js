import React, { useState, useEffect } from 'react';
import { FavoritesService } from '../services/localStorageService';

const ArtistCard = ({ artist }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if artist is in favorites
    setIsFavorite(FavoritesService.isFavorited('artists', artist.id));
  }, [artist.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      FavoritesService.removeFavorite('artists', artist.id);
      setIsFavorite(false);
    } else {
      FavoritesService.addFavorite('artists', artist);
      setIsFavorite(true);
    }
  };

  return (
    <div className="artist">
      <img src={artist.image} alt={artist.name} />
      <h3>{artist.name}</h3>
      <p>Genre: {artist.genre}</p>
      <button 
        onClick={toggleFavorite}
        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
      >
        {isFavorite ? '❤️ Remove Favorite' : '🤍 Add Favorite'}
      </button>
    </div>
  );
};

export default ArtistCard;