import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

const ScrollTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 3000);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`btn-to-top-wrapper d-flex align-items-center justify-content-center ${visible ? 'show' : 'hide'}`}>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-sm btn-to-top rounded-5" aria-label="Scroll to top">
        <FaArrowUp className="icon" />
      </button>
    </div>
  );
};

export default ScrollTop;
