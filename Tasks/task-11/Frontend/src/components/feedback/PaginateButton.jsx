import React, { useCallback, useRef } from 'react';

const PaginateButton = ({ onClick, disabled, debounceDelay = 1000 }) => {
  const timer = useRef(null);
  const handle = useCallback(() => {
    if (timer.current || disabled) return;
    onClick();
    timer.current = setTimeout(() => { timer.current = null; }, debounceDelay);
  }, [onClick, debounceDelay, disabled]);

  return (
    <button className="btn btn-sm btn-primary py-2 px-4 border-0 rounded-5 d-inline-flex align-items-center justify-content-center gap-2" onClick={handle} disabled={disabled}>
      {disabled ? 'Loading...' : 'Load more'}
    </button>
  );
};

export default PaginateButton;
