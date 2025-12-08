
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import './Header.css';
const Header = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLocalSearch = (query) => {
    setLocalSearch(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <Link to="/albums" className={isActive('/albums') ? 'active' : ''}>
          Albums
        </Link>
        <Link to="/artists" className={isActive('/artists') ? 'active' : ''}>
          Artists
        </Link>
        <Link to="/playlists" className={isActive('/playlists') ? 'active' : ''}>
          Playlists
        </Link>

        {!user ? (
          <>
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
            <Link to="/register" className={isActive('/register') ? 'active' : ''}>Register</Link>
          </>
        ) : (
          <>
            {/* Show Admin link if user is admin */}
            {user.role === 'admin' && (
              <Link to="/admin" className={isActive('/admin') ? 'active admin-link' : 'admin-link'}>
                Admin Panel
              </Link>
            )}
            
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard ({user.username})
            </Link>
            
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
