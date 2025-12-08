// Local Storage service for favorites and preferences

// Favorites Management
export const FavoritesService = {
  // Add to favorites
  addFavorite: (type, item) => {
    const favorites = FavoritesService.getFavorites(type);
    const existingIndex = favorites.findIndex(fav => fav.id === item.id);
    
    if (existingIndex === -1) {
      favorites.push({
        ...item,
        favoritedAt: new Date().toISOString()
      });
      localStorage.setItem(`favorite_${type}`, JSON.stringify(favorites));
      return true;
    }
    return false;
  },

  // Remove from favorites
  removeFavorite: (type, itemId) => {
    const favorites = FavoritesService.getFavorites(type);
    const updatedFavorites = favorites.filter(fav => fav.id !== itemId);
    localStorage.setItem(`favorite_${type}`, JSON.stringify(updatedFavorites));
    return true;
  },

  // Get all favorites
  getFavorites: (type) => {
    return JSON.parse(localStorage.getItem(`favorite_${type}`) || '[]');
  },

  // Check if item is favorited
  isFavorited: (type, itemId) => {
    const favorites = FavoritesService.getFavorites(type);
    return favorites.some(fav => fav.id === itemId);
  },

  // Clear all favorites
  clearFavorites: (type) => {
    localStorage.removeItem(`favorite_${type}`);
  }
};

// User Preferences
export const PreferencesService = {
  // Theme preferences
  setTheme: (theme) => {
    localStorage.setItem('userTheme', theme);
  },

  getTheme: () => {
    return localStorage.getItem('userTheme') || 'dark';
  },

  // Volume preference
  setVolume: (volume) => {
    localStorage.setItem('playerVolume', volume.toString());
  },

  getVolume: () => {
    const volume = localStorage.getItem('playerVolume');
    return volume ? parseFloat(volume) : 0.7;
  },

  // Recently viewed
  addToRecentlyViewed: (type, item) => {
    const recent = PreferencesService.getRecentlyViewed(type);
    const existingIndex = recent.findIndex(i => i.id === item.id);
    
    if (existingIndex !== -1) {
      recent.splice(existingIndex, 1);
    }
    
    recent.unshift({
      ...item,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only last 10 items
    const trimmedRecent = recent.slice(0, 10);
    localStorage.setItem(`recent_${type}`, JSON.stringify(trimmedRecent));
  },

  getRecentlyViewed: (type) => {
    return JSON.parse(localStorage.getItem(`recent_${type}`) || '[]');
  },

  // Search history
  addToSearchHistory: (query) => {
    const history = PreferencesService.getSearchHistory();
    const existingIndex = history.indexOf(query);
    
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    history.unshift(query);
    
    // Keep only last 10 searches
    const trimmedHistory = history.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(trimmedHistory));
  },

  getSearchHistory: () => {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
  },

  clearSearchHistory: () => {
    localStorage.removeItem('searchHistory');
  }
};

// Form data persistence (for draft saving)
export const FormService = {
  saveDraft: (formId, data) => {
    localStorage.setItem(`draft_${formId}`, JSON.stringify(data));
  },

  getDraft: (formId) => {
    return JSON.parse(localStorage.getItem(`draft_${formId}`) || '{}');
  },

  clearDraft: (formId) => {
    localStorage.removeItem(`draft_${formId}`);
  }
};