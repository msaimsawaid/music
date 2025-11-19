import React, { useState, useEffect } from 'react';
import { PreferencesService } from '../services/localStorageService';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = PreferencesService.getTheme();
    const themeIsDark = savedTheme === 'dark';
    setIsDark(themeIsDark);
    applyTheme(themeIsDark);
  }, []);

  const applyTheme = (dark) => {
    if (dark) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('light-theme');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Save to localStorage
    PreferencesService.setTheme(newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;