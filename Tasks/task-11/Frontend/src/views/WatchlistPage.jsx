import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/metadata';
import Section from '../components/layout/Section';
import MediaCard from '../components/feedback/MediaCard';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiLogIn } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { formatRating } from '../lib/formatters';

const WatchlistPage = () => {
  usePageTitle('My Watchlist');
  const { user, favorites } = useAuth();

  if (!user) {
    return (
      <section>
        <Section>
          <div className="text-center py-5">
            <FiLogIn className="fs-1 text-secondary mb-3" />
            <p className="text fw-bold fs-5">Sign in to view your watchlist</p>
            <p className="text-secondary mb-3">Save your favorite movies and TV shows</p>
            <button className="btn btn-primary rounded-5 px-4 py-2" data-bs-toggle="modal" data-bs-target="#authModal">Sign In</button>
          </div>
        </Section>
      </section>
    );
  }

  return (
    <section>
      <Section>
        <div className="d-flex align-items-center gap-2 mb-4">
          <FiHeart className="text-primary fs-4" />
          <p className="h5 text m-0 section-heading">My Watchlist</p>
          <span className="badge rounded-pill" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600 }}>{favorites.length}</span>
        </div>
        {favorites.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary">Your watchlist is empty. Start adding movies and shows!</p>
            <Link to="/" className="btn btn-primary rounded-5 px-4 py-2 mt-2">Browse Movies</Link>
          </div>
        ) : (
          <div className="row g-2">
            {favorites.map(fav => (
              <div key={`${fav.type}-${fav.id}`} className="col-lg-2 col-md-3 col-4">
                <MediaCard>
                  <Link to={`/${fav.type === 'movie' ? 'movies' : 'tv-shows'}/${fav.id}`}>
                    <img src={fav.poster ? `https://image.tmdb.org/t/p/w500${fav.poster}` : '/default-poster.svg'} className="card-img-top" alt={fav.title} />
                  </Link>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{fav.type}</small>
                      {fav.rating && <small className="text-secondary d-flex align-items-center"><FaStar className="text-yellow me-1" style={{ fontSize: '0.7rem' }} />{formatRating(fav.rating)}</small>}
                    </div>
                    <div className="title-wrapper"><p className="card-title text m-0">{fav.title}</p></div>
                  </div>
                </MediaCard>
              </div>
            ))}
          </div>
        )}
      </Section>
    </section>
  );
};

export default WatchlistPage;
