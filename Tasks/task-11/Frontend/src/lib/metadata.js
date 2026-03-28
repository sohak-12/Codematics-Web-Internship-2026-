import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => { document.title = `PrimeFlix | ${title}`; }, [title]);
  return title;
};

export default usePageTitle;
