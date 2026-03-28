import React from 'react';

const VideoEmbed = ({ videoKey }) => {
  if (!videoKey) return null;
  return (
    <div className="mt-3 mb-4">
      <div className="trailer-wrapper">
        <div className="ratio ratio-16x9">
          <iframe src={`https://www.youtube.com/embed/${videoKey}`} title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>
  );
};

export default VideoEmbed;
