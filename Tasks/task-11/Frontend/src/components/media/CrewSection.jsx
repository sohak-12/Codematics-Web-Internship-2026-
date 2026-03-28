import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import MediaCard from '../feedback/MediaCard';
import LoadingSpinner from '../feedback/LoadingSpinner';

const CrewSection = ({ credits, creators }) => {
  const [visible, setVisible] = useState(10);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const loaderRef = useRef(null);
  const debounce = useRef(null);
  const observer = useRef(null);
  const isTV = pathname.startsWith('/tv/');

  const loadMore = useCallback(() => {
    if (!loading && visible < credits.length) {
      setLoading(true);
      setTimeout(() => { setVisible(p => p + 10); setLoading(false); }, 800);
    }
  }, [loading, visible, credits.length]);

  const debouncedLoad = useCallback(() => {
    if (debounce.current) return;
    debounce.current = setTimeout(() => { loadMore(); debounce.current = null; }, 300);
  }, [loadMore]);

  useEffect(() => {
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(([e]) => { if (e.isIntersecting) debouncedLoad(); }, { threshold: 1.0 });
    const el = loaderRef.current;
    if (el) observer.current.observe(el);
    return () => { if (el) observer.current?.unobserve(el); clearTimeout(debounce.current); };
  }, [debouncedLoad]);

  const directors = credits.filter(p => p.job === 'Director');
  const writers = credits.filter(p => p.job === 'Writer' || p.job === 'Novel' || p.department === 'Writing');
  const screenplays = credits.filter(p => p.job === 'Screenplay');

  return (
    <div className="peoples">
      <div className="mb-5">
        {!isTV && <><small className="text-secondary m-0 lh-lg">Director: <span className="text-tertiary">{directors.length ? directors.map(d => d.name).join(', ') : '-'}</span></small><div className="hr" /></>}
        {isTV && creators?.length > 0 && <><small className="text-secondary m-0 lh-lg">Creator: <span className="text-tertiary">{creators.map(c => c.name).join(', ')}</span></small><div className="hr" /></>}
        <small className="text-secondary m-0 lh-lg">Writers: <span className="text-tertiary">{writers.length ? writers.map(w => w.name).join(', ') : '-'}</span></small><div className="hr" />
        <small className="text-secondary m-0 lh-lg">Screenplay: <span className="text-tertiary">{screenplays.length ? screenplays.map(s => s.name).join(', ') : '-'}</span></small><div className="hr" />
      </div>
      <p className="h5 text fw-bold mb-3">Cast & Crew</p>
      <div className="row g-2">
        {credits.slice(0, visible).map((p, i) => (
          <div key={`${p.id}-${i}`} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <MediaCard>
              <Link to={`/people/${p.id}`}>
                <LazyLoad height={200} offset={100} placeholder={<img src="/profile.svg" alt="loading" className="card-img-top" />}>
                  <img src={p.profile_path ? `https://image.tmdb.org/t/p/w200${p.profile_path}` : '/profile.svg'} className="card-img-top" alt={p.name || 'Profile'} />
                </LazyLoad>
              </Link>
              <div className="card-body">
                <div className="title-wrapper"><p className="card-title text m-0">{p.name || '-'}</p></div><div className="hr" />
                <small className="text text-secondary m-0">{p.character || p.job || p.roles?.[0]?.character || p.jobs?.[0]?.job || '-'}</small><div className="hr" />
                <small className="text text-secondary m-0">{p.department || p.known_for_department || '-'}</small>
              </div>
            </MediaCard>
          </div>
        ))}
      </div>
      <div ref={loaderRef} className="d-flex justify-content-center pt-4">{loading && <LoadingSpinner />}</div>
    </div>
  );
};

export default CrewSection;
