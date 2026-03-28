import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Section from '../layout/Section';
import MediaCard from '../feedback/MediaCard';
import PaginateButton from '../feedback/PaginateButton';
import LoadingSpinner from '../feedback/LoadingSpinner';
import { FaStar } from 'react-icons/fa';
import { extractYear, formatRating } from '../../lib/formatters';

const dedupe = (arr) => Array.from(new Map(arr.map(i => [i.id, i])).values());

const GenreExplorer = ({ fetchByGenre, fetchGenres, mediaType, cacheKey, detailPath }) => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const busy = useRef(false);

  const iKey = `genre-${genreId}${cacheKey}`, pKey = `genre-${genreId}Page`;

  useEffect(() => {
    const cached = sessionStorage.getItem(iKey);
    if (cached) { setItems(JSON.parse(cached)); setPage(Number(sessionStorage.getItem(pKey))); setLoading(false); return; }
    Promise.all([fetchGenres(), fetchByGenre(genreId, 1)]).then(([genres, data]) => {
      const genre = genres?.find(g => g.id === parseInt(genreId, 10));
      if (!genre) { navigate('/404'); return; }
      const u = dedupe(data || []); setGenreName(genre.name); setItems(u); setHasMore((data||[]).length > 0); setLoading(false);
      sessionStorage.setItem(iKey, JSON.stringify(u)); sessionStorage.setItem(pKey, '1');
    }).catch(() => navigate('/404'));
  }, [genreId, fetchGenres, fetchByGenre, cacheKey, navigate, iKey, pKey]);

  useEffect(() => {
    if (genreName) document.title = `${mediaType === 'movie' ? 'Movie Genre' : 'TV Show Genre'} | ${genreName}`;
  }, [genreName, mediaType]);

  const loadMore = async () => {
    if (busy.current || !hasMore) return;
    busy.current = true; setPaginating(true);
    const next = page + 1;
    try {
      const d = await fetchByGenre(genreId, next);
      if (!d?.length) { setHasMore(false); } else {
        const u = dedupe([...items, ...d]); setItems(u); setPage(next);
        sessionStorage.setItem(iKey, JSON.stringify(u)); sessionStorage.setItem(pKey, String(next));
      }
    } catch {} finally { busy.current = false; setPaginating(false); }
  };

  return (
    <Section>
      {loading ? <div className="d-flex justify-content-center"><LoadingSpinner /></div> : (
        <>
          <div className="row g-2">
            {items.map(item => (
              <div key={item.id} className="col-lg-2 col-md-4 col-6">
                <MediaCard>
                  <Link to={`${detailPath}/${item.id}`}>
                    <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.svg" alt="loading" className="card-img-top" />}>
                      <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.svg'} className="card-img-top" alt={item.title || item.name} />
                    </LazyLoad>
                  </Link>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{extractYear(item.release_date || item.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center"><FaStar className="star-icon text-yellow me-1" />{formatRating(item.vote_average)}</small>
                    </div>
                    <div className="title-wrapper"><p className="card-title text m-0">{item.title || item.name}</p></div>
                  </div>
                </MediaCard>
              </div>
            ))}
          </div>
          {hasMore && <div className="text-center mt-4"><PaginateButton onClick={loadMore} disabled={paginating} /></div>}
        </>
      )}
    </Section>
  );
};

export default GenreExplorer;
