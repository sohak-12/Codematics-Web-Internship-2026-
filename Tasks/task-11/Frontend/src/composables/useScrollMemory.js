import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const useScrollMemory = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const key = `scroll-${pathname}`;

  useEffect(() => {
    let timer;
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(() => sessionStorage.setItem(key, window.scrollY.toString()), 100); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, [key]);

  useEffect(() => { if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; }, []);

  useEffect(() => {
    if (navType === 'POP') {
      const y = parseInt(sessionStorage.getItem(key), 10);
      if (!isNaN(y)) window.scrollTo({ top: y, behavior: 'instant' });
    } else window.scrollTo({ top: 0 });
  }, [pathname, navType, key]);
};
