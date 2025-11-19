import React, { useState, useEffect } from 'react';
import musicData from '../data/musicData.json';
import { searchMusic } from '../services/musicApi';
import AIChat from '../components/AIChat';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadSpinner';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load data from JSON
    setFeaturedPlaylists(musicData.featuredPlaylists);
    setNewReleases(musicData.newReleases);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    
    try {
      const results = await searchMusic(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
    // Show placeholder instead
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.innerHTML = '🎵';
    placeholder.style.width = e.target.style.width;
    placeholder.style.height = e.target.style.height;
    e.target.parentNode.appendChild(placeholder);
  };

  return (
    <div>
      {/* Theme Toggle */}
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Find your next favorite track</h1>
          <p>Curated playlists, trending artists, and new releases. Stream the vibe.</p>
          <div className="hero-ctas">
            <button className="btn-primary">Explore Now</button>
            <button className="btn-outline">Discover Playlists</button>
          </div>
        </div>
        <div className="hero-art">
          <img 
            src="/assets/hero.jpg" 
            alt="music hero"
            onError={handleImageError}
          />
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          <div className="results-grid">
            {searchResults.map((track, index) => (
              <div key={index} className="track-card">
                <img 
                  src={track.artworkUrl100} 
                  alt={track.trackName}
                  onError={handleImageError}
                />
                <h4>{track.trackName}</h4>
                <p>{track.artistName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Featured Playlists */}
      <section className="featured">
        <h2>Featured Playlists</h2>
        <div className="cards">
          {featuredPlaylists.map(playlist => (
            <article key={playlist.id} className="card">
              <div className="cover">
                <img 
                  src={playlist.image} 
                  alt={playlist.title}
                  onError={handleImageError}
                />
              </div>
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <VideoPlayer />

      {/* AI Chat Section */}
      <AIChat />

      {/* New Releases */}
      <section className="grid-preview">
        <h2>New Releases</h2>
        <div className="releases">
          {newReleases.map(release => (
            <div key={release.id} className="tile">
              <img 
                src={release.image} 
                alt={release.title}
                onError={handleImageError}
              />
              <p>{release.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;