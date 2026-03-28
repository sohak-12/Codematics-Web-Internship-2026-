import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppHeader from './components/layout/AppHeader';
import AppNavbar from './components/layout/AppNavbar';
import SearchOverlay from './components/layout/SearchOverlay';
import AppFooter from './components/layout/AppFooter';
import ScrollGuard from './components/layout/ScrollGuard';
import AuthModal from './components/auth/AuthModal';
import LandingPage from './components/auth/LandingPage';
import LoadingSpinner from './components/feedback/LoadingSpinner';
import Views from './views';

const AppContent = () => {
  const { user, loading, loginWithGoogle } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => {
    setSearchOpen(true);
    const el = document.getElementById('searchModal');
    new window.bootstrap.Modal(el).show();
  };

  const openAuth = (mode = 'login') => {
    window.dispatchEvent(new CustomEvent('authModalOpen', { detail: { mode } }));
    const el = document.getElementById('authModal');
    new window.bootstrap.Modal(el).show();
  };

  const handleGoogleSignIn = async () => {
    try { await loginWithGoogle(); }
    catch {}
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Not logged in → Netflix-style landing
  if (!user) {
    // Force dark theme for landing page
    document.documentElement.setAttribute('data-theme', 'dark');
    return (
      <>
        <LandingPage onGoogleSignIn={handleGoogleSignIn} onOpenAuth={openAuth} onOpenSignup={() => openAuth('signup')} onOpenLogin={() => openAuth('login')} />
        <AuthModal />
      </>
    );
  }

  // Logged in → Full app
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--divider)', borderRadius: 'var(--radius-md)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500 }
      }} />
      <ScrollGuard />
      <AppHeader onSearchClick={openSearch} />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Views.Home />} />
          <Route path="/watchlist" element={<Views.Watchlist />} />

          <Route path="/movies" element={<Views.Films.Index />} />
          <Route path="/movies/upcoming" element={<Views.Films.Upcoming />} />
          <Route path="/movies/trending" element={<Views.Films.Trending />} />
          <Route path="/movies/popular" element={<Views.Films.Popular />} />
          <Route path="/movies/now-playing" element={<Views.Films.NowPlaying />} />
          <Route path="/movies/top-rated" element={<Views.Films.TopRated />} />
          <Route path="/movies/genre/:genreId" element={<Views.Films.ByGenre />} />
          <Route path="/movies/:id" element={<Views.Films.Single />} />

          <Route path="/tv-shows" element={<Views.Shows.Index />} />
          <Route path="/tv-shows/trending" element={<Views.Shows.Trending />} />
          <Route path="/tv-shows/popular" element={<Views.Shows.Popular />} />
          <Route path="/tv-shows/top-rated" element={<Views.Shows.TopRated />} />
          <Route path="/tv-shows/airing-today" element={<Views.Shows.AiringToday />} />
          <Route path="/tv-shows/on-the-air" element={<Views.Shows.OnTheAir />} />
          <Route path="/tv-shows/genre/:genreId" element={<Views.Shows.ByGenre />} />
          <Route path="/tv-shows/:id" element={<Views.Shows.Single />} />

          <Route path="/people/popular" element={<Views.Artists.Popular />} />
          <Route path="/people/:personId" element={<Views.Artists.Person />} />

          <Route path="*" element={<Views.NotFound />} />
        </Routes>
      </Suspense>
      <AppFooter />
      <AppNavbar />
      <SearchOverlay show={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--divider)', borderRadius: 'var(--radius-md)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500 }
      }} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
