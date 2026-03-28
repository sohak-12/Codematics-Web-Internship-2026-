import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMovieGenres, getTVGenres } from '../../api/tmdbClient';
import { FaArrowLeft } from 'react-icons/fa6';

const PageTitle = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [genreName, setGenreName] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 3) return 'Good evening';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const title = () => {
    const map = {
      '/': 'PrimeFlix', '/movies': 'Movies', '/movies/upcoming': 'Upcoming Movies',
      '/movies/trending': 'Trending Movies', '/movies/popular': 'Popular Movies',
      '/movies/now-playing': 'Now Playing', '/movies/top-rated': 'Top Rated Movies',
      '/tv-shows': 'TV Shows', '/tv-shows/trending': 'Trending TV Shows',
      '/tv-shows/popular': 'Popular TV Shows', '/tv-shows/top-rated': 'Top Rated TV Shows',
      '/tv-shows/on-the-air': 'TV Shows On The Air', '/tv-shows/airing-today': 'TV Shows Airing Today',
      '/people/popular': 'Popular People', '/watchlist': 'My Watchlist',
    };
    if (map[pathname]) return map[pathname];
    if (pathname.startsWith('/movies/genre/')) return `Movie ${genreName || ''}`;
    if (pathname.startsWith('/movies/')) return 'Movie Details';
    if (pathname.startsWith('/tv-shows/genre/')) return `TV ${genreName || ''}`;
    if (pathname.startsWith('/tv-shows/')) return 'TV Show Details';
    if (pathname.startsWith('/people/')) return 'Person';
    return 'PrimeFlix';
  };

  useEffect(() => {
    const load = async () => {
      const id = pathname.split('/')[3];
      if (!id) return;
      try {
        const genres = pathname.includes('/movies/genre/') ? await getMovieGenres() : await getTVGenres();
        setGenreName(genres?.find(g => g.id === parseInt(id, 10))?.name || '');
      } catch { setGenreName(''); }
    };
    if (pathname.startsWith('/movies/genre/') || pathname.startsWith('/tv-shows/genre/')) load();
    else setGenreName('');
  }, [pathname]);

  return (
    <div className="d-flex align-items-center">
      {pathname !== '/' && (
        <button onClick={() => navigate(-1)} className="icon text p-0 me-3 bg-transparent border-0">
          <FaArrowLeft className="fs-5" />
        </button>
      )}
      <p className={`header-title fw-bold m-0 ${pathname === '/' ? 'header-logo' : 'text'}`}>{pathname === '/' ? '▶ PrimeFlix' : title()}</p>
    </div>
  );
};

export default PageTitle;
