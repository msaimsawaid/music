import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Remove useNavigate
import SearchBar from './SearchBar';

const Header = ({ onSearch }) => {
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleLocalSearch = (query) => {
    setLocalSearch(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="topbar">
      <div className="brand">
        🎵 <span>Music World</span>
      </div>
      
      {/* Search bar - only show on home page */}
      {location.pathname === '/' && (
        <SearchBar onSearch={handleLocalSearch} placeholder="Search artists, albums, songs..." />
      )}
      
      <nav className="topnav">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Home
        </Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}>
          About
        </Link>
        <Link to="/artists" className={isActive('/artists') ? 'active' : ''}>
          Artists
        </Link>
        <Link to="/albums" className={isActive('/albums') ? 'active' : ''}>
          Albums
        </Link>
        <Link to="/playlists" className={isActive('/playlists') ? 'active' : ''}>
          Playlists
        </Link>
        <Link to="/github-search" className={isActive('/github-search') ? 'active' : ''}>
          GitHub Search
        </Link>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;