import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/metadata';
import Section from '../components/layout/Section';
import FilmsTrending from '../components/catalog/films/FilmsTrending';
import FilmsPopular from '../components/catalog/films/FilmsPopular';
import FilmsNowPlaying from '../components/catalog/films/FilmsNowPlaying';
import FilmsTopRated from '../components/catalog/films/FilmsTopRated';
import FilmsUpcoming from '../components/catalog/films/FilmsUpcoming';
import ShowsTrending from '../components/catalog/shows/ShowsTrending';
import ShowsPopular from '../components/catalog/shows/ShowsPopular';
import ShowsTopRated from '../components/catalog/shows/ShowsTopRated';
import ShowsAiring from '../components/catalog/shows/ShowsAiring';
import { getTrendingAll } from '../api/tmdbClient';
import { FaStar, FaFire, FaPlay } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const IMG = 'https://image.tmdb.org/t/p';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 3) return '🌙 Late Night Vibes';
  if (h < 6) return '🌅 Early Bird Special';
  if (h < 12) return '☀️ Good Morning';
  if (h < 17) return '🎬 Afternoon Watch';
  if (h < 21) return '🍿 Evening Picks';
  return '🌙 Night Owl Mode';
};

const HomePage = () => {
  usePageTitle('Welcome');
  const [greet] = useState(greeting);
  const [movies, setMovies] = useState([]);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    getTrendingAll(1).then(d => {
      setMovies((d || []).filter(i => i.backdrop_path && i.poster_path).slice(0, 8));
    }).catch(() => {});
  }, []);

  const goTo = useCallback((i) => { setActive(i); setTick(t => t + 1); }, []);

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => {
      setActive(p => { setTick(t => t + 1); return (p + 1) % movies.length; });
    }, 6000);
    return () => clearInterval(t);
  }, [movies]);

  const m = movies[active];

  return (
    <section>
      <Section>
        <div className="hero-cinema">
          {/* Backdrop slides */}
          <div className="hero-cinema-bgs">
            {movies.map((mv, i) => (
              <div key={mv.id} className={`hero-cinema-bg ${i === active ? 'active' : ''}`}
                style={{ backgroundImage: `url(${IMG}/original${mv.backdrop_path})` }} />
            ))}
          </div>

          {/* Overlays */}
          <div className="hero-cinema-overlay" />
          <div className="hero-cinema-noise" />

          {/* Content */}
          <div className="hero-cinema-body">
            <div className="hero-cinema-info">
              <div className="hero-cinema-greeting">
                <HiSparkles /> {greet}
              </div>

              {m && (
                <>
                  <div className="hero-cinema-trending">
                    <FaFire size={10} /> Trending #{active + 1}
                  </div>
                  <h1 className="hero-cinema-title">{m.title || m.name}</h1>
                  <div className="hero-cinema-meta">
                    <span className="hero-cinema-rating"><FaStar size={12} /> {m.vote_average?.toFixed(1)}</span>
                    <span className="hero-cinema-year">{(m.release_date || m.first_air_date || '').slice(0, 4)}</span>
                    <span className="hero-cinema-type">{m.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
                  </div>
                  <p className="hero-cinema-overview">{m.overview}</p>
                  <Link to={`/${m.media_type === 'tv' ? 'tv-shows' : 'movies'}/${m.id}`} className="hero-cinema-btn">
                    <FaPlay size={11} /> Explore Now
                  </Link>
                </>
              )}
            </div>

            {/* Poster strip */}
            <div className="hero-cinema-posters">
              {movies.map((mv, i) => (
                <div key={mv.id} className={`hero-cinema-poster ${i === active ? 'active' : ''}`} onClick={() => goTo(i)}>
                  <img src={`${IMG}/w342${mv.poster_path}`} alt={mv.title || mv.name} loading="lazy" />
                  <span className="hero-cinema-poster-num">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bars */}
          <div className="hero-cinema-progress" key={tick}>
            {movies.map((_, i) => (
              <div key={i} className={`hero-cinema-pbar ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`} onClick={() => goTo(i)}>
                <div className="hero-cinema-pfill" />
              </div>
            ))}
          </div>
        </div>
      </Section>
      <FilmsNowPlaying />
      <FilmsTrending />
      <ShowsTrending />
      <FilmsPopular />
      <ShowsPopular />
      <FilmsTopRated />
      <ShowsTopRated />
      <FilmsUpcoming />
      <ShowsAiring />
    </section>
  );
};

export default HomePage;
