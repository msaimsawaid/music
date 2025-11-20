import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Playlists from './pages/Playlists';
import Contact from './pages/Contact';
import GitHubSearch from './pages/GitHubSearch';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App theme-dark">
          <Header />
          <ScrollToTop />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/github-search" element={<GitHubSearch />} />
              {/* Add a catch-all route to handle navigation issues */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;