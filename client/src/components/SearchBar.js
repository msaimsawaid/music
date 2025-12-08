import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search songs, artists..." }) => {
  const [query, setQuery] = useState('');
  const debounceRef = useRef();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length > 2) {
      debounceRef.current = setTimeout(() => {
        onSearch(query);
      }, 300);
    } else if (query.trim().length === 0) {
      onSearch('');
    }
  }, [query, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="search-input-real-time"
      />
      {query && (
        <button 
          type="button" 
          className="clear-search"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
        >
          ✕
        </button>
      )}
    </form>
  );
};

export default SearchBar;