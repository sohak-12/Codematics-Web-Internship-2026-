import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import usePageTitle from '../../lib/metadata';
import Section from '../../components/layout/Section';
import MediaCard from '../../components/feedback/MediaCard';
import PaginateButton from '../../components/feedback/PaginateButton';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { getTVGenres, discoverTV } from '../../api/tmdbClient';
import { extractYear, formatRating } from '../../lib/formatters';
import { FaStar, FaFire, FaSortAmountDown } from 'react-icons/fa';
import { BiFilterAlt } from 'react-icons/bi';
import { MdLiveTv } from 'react-icons/md';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'first_air_date.desc', label: 'Latest Release' },
  { value: 'vote_average.desc', label: 'Top Rated' },
];

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 30 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  }),
];

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '8', label: '8+ ★' },
  { value: '7', label: '7+ ★' },
  { value: '6', label: '6+ ★' },
  { value: '5', label: '5+ ★' },
];

const LANG_OPTIONS = [
  { value: '', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'tr', label: 'Turkish' },
];

const dedupe = (arr) => Array.from(new Map(arr.map(i => [i.id, i])).values());

const ShowsIndex = () => {
  usePageTitle('TV Shows');
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [lang, setLang] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const busy = useRef(false);

  useEffect(() => { getTVGenres().then(g => setGenres(g || [])); }, []);

  const fetchShows = useCallback(async (pg = 1, reset = false) => {
    if (busy.current) return;
    busy.current = true;
    if (reset) { setLoading(true); setItems([]); }
    else setPaginating(true);

    const params = { page: pg, sort_by: sortBy };
    if (activeGenre) params.with_genres = activeGenre;
    if (year) params.first_air_date_year = year;
    if (rating) params['vote_average.gte'] = rating;
    if (lang) params.with_original_language = lang;

    try {
      const data = await discoverTV(params);
      const results = data?.results || [];
      if (reset) setItems(dedupe(results));
      else setItems(prev => dedupe([...prev, ...results]));
      setHasMore(results.length >= 20);
      setPage(pg);
    } catch {}
    finally { setLoading(false); setPaginating(false); busy.current = false; }
  }, [sortBy, activeGenre, year, rating, lang]);

  useEffect(() => { fetchShows(1, true); }, [fetchShows]);

  const loadMore = () => { if (!paginating && hasMore) fetchShows(page + 1); };

  const selectStyle = {
    background: 'var(--bg-primary)', border: '1px solid var(--divider)', color: 'var(--text-primary)',
    borderRadius: 10, padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
    cursor: 'pointer', outline: 'none', minWidth: 130,
  };

  return (
    <section>
      <Section>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <MdLiveTv className="text-primary fs-4" />
            <p className="h5 text m-0 section-heading">Discover TV Shows</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <button onClick={() => setShowFilters(f => !f)} className="btn btn-sm d-flex align-items-center gap-1"
              style={{ background: showFilters ? 'var(--accent-soft)' : 'var(--bg-primary)', border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--divider)'}`, color: showFilters ? 'var(--accent)' : 'var(--text-secondary)', borderRadius: 10, padding: '6px 14px', fontWeight: 600, fontSize: '0.8rem' }}>
              <BiFilterAlt /> Filters
            </button>
            <div className="d-flex align-items-center gap-1">
              <FaSortAmountDown style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3 overflow-auto scrollbar-custom pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setActiveGenre('')} className="btn btn-sm flex-shrink-0"
            style={{ background: !activeGenre ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))' : 'var(--bg-primary)', color: !activeGenre ? '#fff' : 'var(--text-secondary)', border: `1px solid ${!activeGenre ? 'var(--accent)' : 'var(--divider)'}`, borderRadius: 50, padding: '6px 16px', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            <FaFire size={10} style={{ marginRight: 4 }} /> All
          </button>
          {genres.map(g => (
            <button key={g.id} onClick={() => setActiveGenre(String(g.id) === activeGenre ? '' : String(g.id))} className="btn btn-sm flex-shrink-0"
              style={{ background: String(g.id) === activeGenre ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))' : 'var(--bg-primary)', color: String(g.id) === activeGenre ? '#fff' : 'var(--text-secondary)', border: `1px solid ${String(g.id) === activeGenre ? 'var(--accent)' : 'var(--divider)'}`, borderRadius: 50, padding: '6px 16px', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
              {g.name}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="d-flex gap-2 mb-3 flex-wrap" style={{ animation: 'pageReveal 0.3s ease-out' }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
              {YEAR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={rating} onChange={e => setRating(e.target.value)} style={selectStyle}>
              {RATING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={lang} onChange={e => setLang(e.target.value)} style={selectStyle}>
              {LANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {(year || rating || lang) && (
              <button onClick={() => { setYear(''); setRating(''); setLang(''); }} className="btn btn-sm"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '6px 14px', fontWeight: 600, fontSize: '0.78rem' }}>
                Clear All
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center py-5"><LoadingSpinner /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-5"><p className="text-secondary">No TV shows found. Try different filters.</p></div>
        ) : (
          <>
            <div className="row g-2">
              {items.map(item => (
                <div key={item.id} className="col-lg-2 col-md-3 col-4">
                  <MediaCard>
                    <Link to={`/tv-shows/${item.id}`}>
                      <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.svg" alt="loading" className="card-img-top" />}>
                        <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.svg'} className="card-img-top" alt={item.name || '-'} />
                      </LazyLoad>
                    </Link>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                        <small className="text-secondary">{extractYear(item.first_air_date)}</small>
                        <small className="text-secondary d-flex align-items-center"><FaStar className="star-icon text-yellow me-1" />{formatRating(item.vote_average)}</small>
                      </div>
                      <div className="title-wrapper"><p className="card-title text m-0">{item.name}</p></div>
                    </div>
                  </MediaCard>
                </div>
              ))}
            </div>
            {hasMore && <div className="text-center mt-4"><PaginateButton onClick={loadMore} disabled={paginating} /></div>}
          </>
        )}
      </Section>
    </section>
  );
};

export default ShowsIndex;
