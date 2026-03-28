import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const FavoriteButton = ({ id, type, title, poster, rating }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const liked = isFavorite(id, type);

  return (
    <button
      onClick={() => toggleFavorite({ id, type, title, poster, rating })}
      className="btn btn-sm rounded-5 py-1 px-3 d-flex align-items-center gap-1"
      style={{
        background: liked ? 'linear-gradient(135deg, #ef4444, #ec4899)' : 'var(--surface-hover)',
        color: liked ? '#fff' : 'var(--text-primary)',
        border: liked ? 'none' : '1px solid var(--divider)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: liked ? 'scale(1)' : 'scale(1)',
      }}
    >
      {liked ? <FaHeart /> : <FiHeart />}
      <small className="fw-bold">{liked ? 'Saved' : 'Watchlist'}</small>
    </button>
  );
};

export default FavoriteButton;
