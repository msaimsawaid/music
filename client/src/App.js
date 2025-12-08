
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';      
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Playlists from './pages/Playlists';
import Contact from './pages/Contact';
import GitHubSearch from './pages/GitHubSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard'; // ADD THIS LINE

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

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
      <AuthProvider>
        <Router>
          <div className="App theme-dark">
            <Header />
            <ScrollToTop />
            <main className="container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/github-search" element={<GitHubSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes - Regular Users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Protected Routes - Admin Only */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
