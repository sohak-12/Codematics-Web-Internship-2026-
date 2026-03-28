import { useState, useEffect, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BiMoviePlay } from 'react-icons/bi';
import { FaStar, FaFire, FaPlay } from 'react-icons/fa';
import { MdDevices } from 'react-icons/md';
import { FiHeart, FiSearch } from 'react-icons/fi';
import { getTrendingAll } from '../../api/tmdbClient';
import './LandingPage.css';

const IMG = 'https://image.tmdb.org/t/p';

const FEATURES = [
  { icon: <FaPlay size={11} />, text: 'HD Trailers' },
  { icon: <FiHeart size={11} />, text: 'Watchlist Sync' },
  { icon: <FiSearch size={11} />, text: 'Smart Search' },
  { icon: <MdDevices size={11} />, text: 'Any Device' },
];

const LandingPage = ({ onGoogleSignIn, onOpenSignup, onOpenLogin }) => {
  const [movies, setMovies] = useState([]);
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0); // for progress bar reset

  useEffect(() => {
    getTrendingAll(1).then(d => {
      setMovies((d || []).filter(i => i.backdrop_path && i.poster_path).slice(0, 8));
    }).catch(() => {});
  }, []);

  const goTo = useCallback((idx) => {
    setActive(idx);
    setKey(k => k + 1);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => {
      setActive(p => {
        const next = (p + 1) % movies.length;
        setKey(k => k + 1);
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [movies]);

  const m = movies[active];

  return (
    <div className="landing-master">
      {/* Aurora Background */}
      <div className="landing-aurora">
        <div className="landing-aurora-beam" />
        <div className="landing-aurora-beam" />
        <div className="landing-aurora-beam" />
      </div>

      {/* ═══ LEFT: Cinematic Showcase (Desktop) ═══ */}
      <div className="landing-cinema">
        {/* Full-bleed backdrop transitions */}
        <div className="landing-backdrop-layer">
          {movies.map((mv, i) => (
            <div
              key={mv.id}
              className={`landing-backdrop-img ${i === active ? 'active' : ''}`}
              style={{ backgroundImage: `url(${IMG}/original${mv.backdrop_path})` }}
            />
          ))}
        </div>

        {/* Brand top-left */}
        <div className="landing-brand-float">
          <BiMoviePlay />
          <span className="landing-brand-name">PrimeFlix</span>
        </div>

        {/* Movie Info Overlay */}
        <div className="landing-cinema-content">
          {m && (
            <>
              <div className="landing-trending-badge">
                <FaFire size={10} /> Trending #{active + 1} Today
              </div>

              <h1 className="landing-movie-title">{m.title || m.name}</h1>

              <div className="landing-movie-meta">
                <span className="landing-meta-chip rating">
                  <FaStar size={12} /> {m.vote_average?.toFixed(1)}
                </span>
                <span className="landing-meta-chip year">
                  {(m.release_date || m.first_air_date || '').slice(0, 4)}
                </span>
                <span className="landing-meta-chip type">
                  {m.media_type === 'tv' ? 'TV Series' : 'Movie'}
                </span>
              </div>

              <p className="landing-movie-overview">{m.overview}</p>
            </>
          )}

          {/* Poster Carousel */}
          <div className="landing-poster-row">
            {movies.map((mv, i) => (
              <div
                key={mv.id}
                className={`landing-poster-card ${i === active ? 'active' : ''}`}
                onClick={() => goTo(i)}
              >
                <img src={`${IMG}/w342${mv.poster_path}`} alt={mv.title || mv.name} loading="lazy" />
                <span className="landing-poster-number">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="landing-progress-row" key={key}>
            {movies.map((_, i) => (
              <div
                key={i}
                className={`landing-progress-bar ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
                onClick={() => goTo(i)}
              >
                <div className="landing-progress-fill" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MOBILE: Hero (< 1024px) ═══ */}
      <div className="landing-mobile-hero">
        {movies.map((mv, i) => (
          <div
            key={mv.id}
            className={`landing-mobile-bg ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${IMG}/w780${mv.backdrop_path})` }}
          />
        ))}
        <div className="landing-mobile-hero-content">
          <div className="landing-mobile-brand">
            <BiMoviePlay />
            <span>PrimeFlix</span>
          </div>
          {m && (
            <>
              <h2 className="landing-mobile-movie-title">{m.title || m.name}</h2>
              <div className="landing-mobile-movie-meta">
                <span><FaStar size={10} style={{ color: '#fbbf24' }} /> {m.vote_average?.toFixed(1)}</span>
                <span>{(m.release_date || m.first_air_date || '').slice(0, 4)}</span>
                <span>{m.media_type === 'tv' ? 'TV' : 'Movie'}</span>
              </div>
            </>
          )}
        </div>
        {/* Mobile poster strip */}
        <div className="landing-mobile-posters">
          {movies.map((mv, i) => (
            <div
              key={mv.id}
              className={`landing-mobile-poster-item ${i === active ? 'active' : ''}`}
              onClick={() => goTo(i)}
            >
              <img src={`${IMG}/w185${mv.poster_path}`} alt={mv.title || mv.name} loading="lazy" />
            </div>
          ))}
        </div>
        {/* Mobile progress */}
        <div className="landing-mobile-progress" key={`m-${key}`}>
          {movies.map((_, i) => (
            <div key={i} className={`landing-mobile-progress-bar ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}>
              <div className="landing-mobile-progress-fill" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT: Auth Panel ═══ */}
      <div className="landing-auth-panel">
        <div className="landing-auth-card">
          <div className="landing-card-glow" />
          <div className="landing-auth-inner">
            <div className="landing-auth-header">
              <h2>Start Watching Now</h2>
              <p>Unlimited movies, TV shows & more</p>
            </div>

            <div className="landing-cta-group">
              <button className="landing-btn-google" onClick={onGoogleSignIn}>
                <FcGoogle size={20} /> Continue with Google
              </button>

              <div className="landing-divider">
                <div className="landing-divider-line" />
                <span className="landing-divider-text">or</span>
                <div className="landing-divider-line" />
              </div>

              <button className="landing-btn-email" onClick={onOpenSignup}>
                Sign Up with Email
              </button>
            </div>

            <p className="landing-signin-link">
              Already have an account? <button onClick={onOpenLogin}>Sign In</button>
            </p>

            <div className="landing-divider">
              <div className="landing-divider-line" />
              <span className="landing-divider-text">features</span>
              <div className="landing-divider-line" />
            </div>

            <div className="landing-features-mini">
              {FEATURES.map((f, i) => (
                <div key={i} className="landing-feature-item">
                  <span className="landing-feature-icon">{f.icon}</span>
                  <span className="landing-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="landing-bottom-footer">
        &copy;{new Date().getFullYear()} PrimeFlix &middot; Powered by TMDb
        <span style={{ display: 'block', marginTop: '4px', fontSize: '0.65rem', opacity: 0.6 }}>Developed by Soha Muzammil</span>
      </div>
    </div>
  );
};

export default LandingPage;
