import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';

const ContentPlaceholder = () => {
  const [count, setCount] = useState(6);
  useEffect(() => {
    const update = () => setCount(window.innerWidth < 500 ? 3 : 6);
    update(); window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="overflow-auto scrollbar-custom">
      <div className="d-flex gap-2 justify-content-start">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
            <MediaCard>
              <img src="/default-poster.svg" alt="loading" />
              <div className="card-body pt-3">
                <div className="skeleton mb-2"></div>
                <div className="skeleton"></div>
              </div>
            </MediaCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPlaceholder;
