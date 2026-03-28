import React from 'react';

const GenreMapper = ({ genreIds = [], genres = [] }) => {
  const names = genreIds.map(id => genres.find(g => g.id === id)?.name || 'Unknown').join(', ');
  return <span className="text-secondary">{names}</span>;
};

export default GenreMapper;
