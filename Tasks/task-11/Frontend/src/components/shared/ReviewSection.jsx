import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import ExpandableText from '../feedback/ExpandableText';

const ReviewSection = ({ fetchFn }) => {
  const [reviews, setReviews] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    fetchFn().then(d => setReviews((d || []).slice(0, 5))).catch(() => {});
  }, [fetchFn]);

  if (!reviews.length) return null;

  const toggle = (id) => setExpandedIds(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="mt-4">
      <p className="h5 text fw-bold mb-3 section-heading">User Reviews</p>
      <div className="d-flex flex-column gap-3">
        {reviews.map(r => {
          const content = r.content || '';
          const isLong = content.length > 300;
          const expanded = expandedIds[r.id];
          const text = expanded || !isLong ? content : `${content.slice(0, 300)}...`;
          const rating = r.author_details?.rating;

          return (
            <div key={r.id} className="p-3 rounded-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--divider)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                    {(r.author || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <small className="text fw-bold d-block">{r.author}</small>
                    <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</small>
                  </div>
                </div>
                {rating && (
                  <span className="d-flex align-items-center gap-1 px-2 py-1 rounded-5" style={{ background: 'var(--accent-soft)', fontSize: '0.8rem' }}>
                    <FaStar className="text-yellow" style={{ fontSize: '0.7rem' }} />
                    <small className="text fw-bold">{rating}/10</small>
                  </span>
                )}
              </div>
              <p className="text-tertiary mb-0" style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
                {text}
                <ExpandableText isLong={isLong} expanded={expanded} onToggle={() => toggle(r.id)} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;
