import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import MediaCard from '../feedback/MediaCard';
import { extractYear, formatRating } from '../../lib/formatters';
import { FaStar } from 'react-icons/fa';

const SimilarContent = ({ title, fetchFn, basePath }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFn().then(d => setItems((d || []).slice(0, 12))).catch(() => {});
  }, [fetchFn]);

  if (!items.length) return null;

  return (
    <div className="mt-4">
      <p className="h5 text fw-bold mb-3 section-heading">{title}</p>
      <div className="overflow-auto scrollbar-custom">
        <div className="d-flex gap-2">
          {items.map(item => (
            <div key={item.id} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2" style={{ minWidth: 150 }}>
              <MediaCard>
                <Link to={`/${basePath}/${item.id}`}>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.svg" alt="loading" className="card-img-top" />}>
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.svg'} className="card-img-top" alt={item.title || item.name} />
                  </LazyLoad>
                </Link>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                    <small className="text-secondary">{extractYear(item.release_date || item.first_air_date)}</small>
                    <small className="text-secondary d-flex align-items-center"><FaStar className="text-yellow me-1" style={{ fontSize: '0.7rem' }} />{formatRating(item.vote_average)}</small>
                  </div>
                  <div className="title-wrapper"><p className="card-title text m-0" style={{ fontSize: '0.8rem' }}>{item.title || item.name}</p></div>
                </div>
              </MediaCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarContent;
