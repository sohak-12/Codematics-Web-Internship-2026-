import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { getShowById, getShowCredits, getTVGenres, getShowExternalIds, getTVTrailers, getSimilarShows, getShowRecommendations, getShowReviews } from '../../api/tmdbClient';
import VideoEmbed from '../catalog/previews/VideoEmbed';
import CrewSection from './CrewSection';
import SimilarContent from '../shared/SimilarContent';
import ReviewSection from '../shared/ReviewSection';
import Section from '../layout/Section';
import { FaStar } from 'react-icons/fa';
import { extractYear, formatRating } from '../../lib/formatters';
import LoadingSpinner from '../feedback/LoadingSpinner';
import ScrollTop from '../feedback/ScrollTop';
import ExpandableText from '../feedback/ExpandableText';
import FavoriteButton from '../auth/FavoriteButton';
import { FaPlay } from 'react-icons/fa';

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [credits, setCredits] = useState([]);
  const [creators, setCreators] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [extIds, setExtIds] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setShow(null); setTrailerKey(null); setCredits([]); setCreators([]); setExtIds(null);
        const data = await getShowById(id);
        if (!data?.name) { navigate('/404'); return; }
        const [creds, , ext, trailers] = await Promise.all([getShowCredits(id), getTVGenres(), getShowExternalIds(id), getTVTrailers(id)]);
        setShow(data); setCredits(creds.cast.concat(creds.crew)); setCreators(data.created_by || []); setExtIds(ext);
        if (trailers?.length) setTrailerKey(trailers[0].key);
        document.title = `PrimeFlix | ${data.name}`;
      } catch { navigate('/404'); }
    };
    load();
  }, [id, navigate]);

  if (!show) return <div className="d-flex justify-content-center pt-4 position-absolute top-50 start-50 translate-middle"><LoadingSpinner /></div>;

  const hasBg = Boolean(show.backdrop_path);
  const overview = show.overview || '';
  const isLong = overview.length > 200;
  const text = expanded || !isLong ? overview : `${overview.slice(0, 200)}...`;

  return (
    <Section>
      <div className="row g-3 mb-3">
        {hasBg && <div className="col-lg-5">
          <LazyLoad height={200} offset={0} placeholder={<img src="/default-backdrop.svg" alt="loading" className="single-image rounded-4 w-100" />}>
            <img src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`} className="single-image rounded-4 w-100" alt={show.name} />
          </LazyLoad>
        </div>}
        <div className={hasBg ? 'col-lg-7' : 'col-12'}>
          <div className="d-flex justify-content-md-start justify-content-between align-items-center mb-3">
            <div className="d-flex me-md-3">
              <span className="text-secondary d-flex align-items-center"><FaStar className="text-yellow me-1" />{formatRating(show.vote_average)}</span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{show.first_air_date ? extractYear(show.first_air_date) : '-'}</span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{show.production_countries?.[0]?.iso_3166_1}</span>
            </div>
            {trailerKey && <button onClick={() => setShowPlayer(true)} className="btn btn-sm rounded-5 py-1 px-3 d-flex align-items-center gap-1" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', border: 'none', fontWeight: 600 }}><FaPlay style={{ fontSize: '0.6rem' }} /> Watch Now</button>}
            {extIds?.imdb_id && <a href={`https://www.imdb.com/title/${extIds.imdb_id}`} className="btn btn-sm btn-primary border-0 rounded-5 py-1 px-3" target="_blank" rel="noopener noreferrer">IMDb</a>}
            <FavoriteButton id={show.id} type="tv" title={show.name} poster={show.poster_path} rating={show.vote_average} />
          </div>
          <div className="mb-3">
            {show.spoken_languages?.length > 0 && <div className="row"><small className="text-secondary col-sm-2 col-3">Language</small><small className="text col-8 pe-0">{show.spoken_languages.map(l => l.english_name).join(', ')}</small></div>}
            {show.status && <div className="row"><small className="text-secondary col-sm-2 col-3">Status</small><small className="text col-7">{show.status}</small></div>}
            {show.genres?.length > 0 && <div className="d-sm-flex gap-1 mt-3">{show.genres.map(g => <Link key={g.id} to={`/tv-shows/genre/${g.id}`} className="btn btn-sm btn-genre fw-normal text rounded-5 py-1 px-3 mb-sm-0 mb-1 me-sm-0 me-1">{g.name}</Link>)}</div>}
          </div>
          <h4 className="text fw-bold lh-base mb-3">{show.name}</h4>
          <p className="card-text text-tertiary lh-lg mb-0">{text}<ExpandableText isLong={isLong} expanded={expanded} onToggle={() => setExpanded(!expanded)} /></p>
        </div>
      </div>
      <div className="mb-2"><div className="overflow-auto scrollbar-custom"><div className="d-flex gap-2 mb-3">{show.production_companies?.map(c => <small key={c.id} className="text company-name rounded-3">{c.name}</small>)}</div></div></div>
      {/* Full-screen Player Modal */}
      {showPlayer && trailerKey && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pageReveal 0.3s ease' }}>
          <button onClick={() => setShowPlayer(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '1.5rem', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
          <div style={{ width: '90%', maxWidth: 1000 }}>
            <div className="ratio ratio-16x9">
              <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`} title="Watch" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen style={{ borderRadius: 16 }} />
            </div>
            <p className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{show.name} — Official Trailer</p>
          </div>
        </div>
      )}
      {trailerKey && <VideoEmbed videoKey={trailerKey} />}
      <CrewSection credits={credits} creators={creators} />
      <SimilarContent title="Similar TV Shows" fetchFn={() => getSimilarShows(id)} basePath="tv-shows" />
      <SimilarContent title="Recommended For You" fetchFn={() => getShowRecommendations(id)} basePath="tv-shows" />
      <ReviewSection fetchFn={() => getShowReviews(id)} />
      <ScrollTop />
    </Section>
  );
};

export default ShowDetails;
