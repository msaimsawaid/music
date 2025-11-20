import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Add this import
import musicData from '../data/musicData.json';
import { searchMusic, getPopularSongs } from '../services/itunesApi';
import AIChat from '../components/AIChat';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadSpinner';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularSongs, setPopularSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const location = useLocation(); // Add this
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setFeaturedPlaylists(musicData.featuredPlaylists);
    setNewReleases(musicData.newReleases);
    loadPopularSongs();
  }, []);

  // FIX: Reset search state when navigating to/from Home page
  useEffect(() => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]); // Reset when route changes

  const loadPopularSongs = async () => {
    try {
      setApiLoading(true);
      const songs = await getPopularSongs();
      setPopularSongs(songs || []); // Added fallback
    } catch (error) {
      console.error('Failed to load popular songs:', error);
      setPopularSongs([]); // Ensure it's always an array
    } finally {
      setApiLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchQuery('');
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    setShowSearchResults(true);

    try {
      const results = await searchMusic(query, 12);
      setSearchResults(results || []); // Added fallback
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.innerHTML = '🎵';
    e.target.parentNode.appendChild(placeholder);
  };

  // FIXED: Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target) &&
          !event.target.closest('.search-results-dropdown') &&
          !event.target.closest('.search-results-full')) {
        setShowSearchResults(false);
      }
    };

    // Only add event listener when search results are shown
    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <ThemeToggle />
      </div>

      {/* Hero Section with Search */}
      <section className="hero">
        <div className="hero-text">
          <h1>Discover Music Instantly</h1>
          <p>Search for any song, artist, or album. Results appear as you type!</p>
          
          {/* Enhanced Search in Hero - Add ref here */}
          <div className="hero-search-container" ref={searchContainerRef}>
            <SearchBar onSearch={handleSearch} placeholder="Search for songs, artists, or albums..." />
            
            {/* Real-time Search Results Dropdown */}
            {showSearchResults && (
              <div className="search-results-dropdown">
                <div className="search-results-header">
                  <h4>Search Results for "{searchQuery}"</h4>
                  <button 
                    className="close-results"
                    onClick={() => setShowSearchResults(false)}
                  >
                    ✕
                  </button>
                </div>
                
                {loading ? (
                  <div className="search-loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p>Searching...</p>
                  </div>
                ) : (
                  <div className="search-results-content">
                    {searchResults.length > 0 ? (
                      <div className="real-time-results">
                        {searchResults.slice(0, 6).map((track, index) => (
                          <div key={index} className="search-result-item">
                            <img 
                              src={track.artworkUrl100} 
                              alt={track.trackName}
                              onError={handleImageError}
                            />
                            <div className="track-info">
                              <h5>{track.trackName}</h5>
                              <p>{track.artistName}</p>
                              <small>{track.collectionName}</small>
                            </div>
                            <div className="play-indicator">▶</div>
                          </div>
                        ))}
                        {searchResults.length > 6 && (
                          <div className="view-all-results">
                            <button 
                              className="btn-outline"
                              onClick={() => setShowSearchResults(true)}
                            >
                              View all {searchResults.length} results
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-results">
                        <p>No results found for "{searchQuery}"</p>
                        <small>Try different keywords</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

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

      {/* Full Search Results Section */}
      {showSearchResults && searchResults.length > 0 && (
        <section className="search-results-full">
          <div className="search-results-header-full">
            <h2>Search Results for "{searchQuery}"</h2>
            <button 
              className="btn-outline"
              onClick={() => setShowSearchResults(false)}
            >
              Close Results
            </button>
          </div>
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
                <small>{track.collectionName}</small>
                {track.previewUrl && track.previewUrl !== '#' && (
                  <audio controls className="audio-preview">
                    <source src={track.previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Show all other content when NOT showing search results */}
      {!showSearchResults && (
        <section className="featured">
          <h2>🔥 Popular Right Now</h2>
          {apiLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="cards">
              {popularSongs.map((song, index) => (
                <article key={index} className="card">
                  <div className="cover">
                    <img 
                      src={song.artworkUrl100} 
                      alt={song.trackName}
                      onError={handleImageError}
                    />
                  </div>
                  <h3>{song.trackName}</h3>
                  <p>{song.artistName}</p>
                  <small>{song.collectionName}</small>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {!showSearchResults && (
        <>
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

          <VideoPlayer />
          <AIChat />

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
        </>
      )}
    </div>
  );
};

export default Home;