import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Section from '../../layout/Section';
import MediaCard from '../../feedback/MediaCard';
import PaginateButton from '../../feedback/PaginateButton';
import LoadingSpinner from '../../feedback/LoadingSpinner';
import { getPopularPeople } from '../../../api/tmdbClient';

const dedupe = (arr) => Array.from(new Map(arr.map(p => [p.id, p])).values());

const ArtistsGrid = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const iKey = 'artistsItems', pKey = 'artistsPage';

  useEffect(() => {
    const cached = sessionStorage.getItem(iKey);
    if (cached) { setPeople(JSON.parse(cached)); setPage(Number(sessionStorage.getItem(pKey)) || 1); setLoading(false); return; }
    getPopularPeople(1).then(d => {
      const u = dedupe(d || []); setPeople(u); setHasMore((d||[]).length > 0); setLoading(false);
      sessionStorage.setItem(iKey, JSON.stringify(u)); sessionStorage.setItem(pKey, '1');
    }).catch(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (paginating || !hasMore) return;
    setPaginating(true);
    const next = page + 1;
    try {
      const d = await getPopularPeople(next);
      if (!d?.length) { setHasMore(false); } else {
        const u = dedupe([...people, ...d]); setPeople(u); setPage(next);
        sessionStorage.setItem(iKey, JSON.stringify(u)); sessionStorage.setItem(pKey, String(next));
      }
    } catch {} finally { setPaginating(false); }
  };

  return (
    <Section>
      {loading ? <div className="d-flex justify-content-center"><LoadingSpinner /></div> : (
        <>
          <div className="row g-2">
            {people.map(p => (
              <div key={p.id} className="col-lg-2 col-md-3 col-4">
                <MediaCard>
                  <Link to={`/people/${p.id}`}>
                    <LazyLoad height={200} offset={100} placeholder={<img src="/profile.svg" alt="loading" className="card-img-top" />}>
                      <img src={p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : '/profile.svg'} className="card-img-top" alt={p.name} />
                    </LazyLoad>
                  </Link>
                  <div className="card-body px-2 pb-3"><div className="title-wrapper"><p className="card-title text m-0">{p.name}</p></div></div>
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

export default ArtistsGrid;
