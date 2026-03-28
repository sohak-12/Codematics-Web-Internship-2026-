import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Section from '../layout/Section';
import MediaCard from '../feedback/MediaCard';
import ViewMoreCard from '../feedback/ViewMoreCard';
import ContentPlaceholder from '../feedback/ContentPlaceholder';
import { extractYear, formatRating } from '../../lib/formatters';
import { FaStar } from 'react-icons/fa';

const ContentCarousel = ({ title, link, fetchFn, mediaType = 'movie' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn().then(d => setItems(d || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, [fetchFn]);

  const basePath = mediaType === 'movie' ? 'movies' : 'tv-shows';

  return (
    <Section>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <p className="h5 text m-0 section-heading">{title}</p>
        <Link to={link} className="btn-link">Show all</Link>
      </div>
      {loading ? <ContentPlaceholder /> : (
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 justify-content-start">
            {items.map(item => (
              <div key={item.id} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
                <MediaCard>
                  <Link to={`/${basePath}/${item.id}`}>
                    <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.svg" alt="loading" className="card-img-top" />}>
                      <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.svg'} className="card-img-top" alt={item.title || item.name || '-'} />
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
            <div className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2"><ViewMoreCard to={link} /></div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default ContentCarousel;
