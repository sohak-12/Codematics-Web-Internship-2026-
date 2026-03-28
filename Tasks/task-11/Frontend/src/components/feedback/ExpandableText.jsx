import React from 'react';

const ExpandableText = ({ isLong, expanded, onToggle }) => {
  if (!isLong) return null;
  return (
    <button onClick={onToggle} className="btn btn-link ps-0 fw-normal align-baseline" style={{ lineHeight: 'inherit', padding: 0 }}>
      {expanded ? '- Show less' : 'Read more'}
    </button>
  );
};

export default ExpandableText;
