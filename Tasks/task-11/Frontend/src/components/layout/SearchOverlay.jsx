import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchAll } from '../../api/tmdbClient';
import { IoCloseOutline } from 'react-icons/io5';
import { FaRegUser, FaHashtag } from 'react-icons/fa';
import { BiMoviePlay } from 'react-icons/bi';
import { MdLiveTv } from 'react-icons/md';

const ICONS = { movie: BiMoviePlay, person: FaRegUser, keyword: FaHashtag, tv: MdLiveTv };

const SearchOverlay = ({ show, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    searchAll(query).then(d => { setResults(d?.results || []); setLoading(false); });
  }, [query]);

  useEffect(() => {
    const el = document.getElementById('searchModal');
    if (show && el) {
      const modal = new window.bootstrap.Modal(el);
      modal.show();
      const onHidden = () => {
        setQuery(''); setResults([]);
        document.querySelector('.modal-backdrop')?.remove();
        if (document.body?.style) { document.body.style.overflow = ''; document.body.style.paddingRight = ''; document.body.removeAttribute('data-bs-overflow'); document.body.removeAttribute('data-bs-padding-right'); }
        el.style.display = 'none';
        window.bootstrap.Modal.getInstance(el)?.dispose();
        onClose();
      };
      el.addEventListener('hidden.bs.modal', onHidden);
      return () => {
        el.removeEventListener('hidden.bs.modal', onHidden);
        window.bootstrap.Modal.getInstance(el)?.dispose();
        document.querySelector('.modal-backdrop')?.remove();
        if (document.body?.style) { document.body.style.overflow = ''; document.body.style.paddingRight = ''; document.body.removeAttribute('data-bs-overflow'); document.body.removeAttribute('data-bs-padding-right'); }
      };
    } else if (el) { el.style.display = 'none'; document.querySelector('.modal-backdrop')?.remove(); }
  }, [show, onClose]);

  const dismiss = () => {
    const el = document.getElementById('searchModal');
    if (el) { const m = window.bootstrap.Modal.getInstance(el); if (m) { m.hide(); m.dispose(); } el.style.display = 'none'; document.querySelector('.modal-backdrop')?.remove(); }
    setQuery(''); setResults([]); onClose();
  };

  const linkFor = (r) => {
    if (r.media_type === 'movie') return `/movies/${r.id}`;
    if (r.media_type === 'tv') return `/tv-shows/${r.id}`;
    if (r.media_type === 'person') return `/people/${r.id}`;
    return `/keyword/${r.id}`;
  };

  return (
    <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-fullscreen-md-down modal-dialog-scrollable">
        <div className="modal-content modal-search" style={{ height: '100vh' }}>
          <div className="modal-header d-grid border-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="fs-5 modal-title text" id="searchModalLabel">Explore</p>
              <button type="button" className="text-secondary bg-transparent border-0" data-bs-dismiss="modal" aria-label="Close"><IoCloseOutline className="icon fs-1" /></button>
            </div>
            <input type="text" className="form-control form-input-custom py-3 rounded-3" placeholder="Search movies, shows, people..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="modal-body scrollbar-custom" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div className="search-suggest-body">
              {loading && <p className="text-center text-secondary">Searching...</p>}
              {!loading && query && results.length > 0 && results.map((r, i) => {
                const Icon = ICONS[r.media_type] || FaRegUser;
                return (
                  <React.Fragment key={r.id}>
                    <Link to={linkFor(r)} className="text d-flex align-items-center search-result-item" onClick={dismiss}>
                      <Icon className="me-2" style={{ fontSize: '1rem', flexShrink: 0 }} />
                      {r.name || r.title || r.keyword}
                    </Link>
                  </React.Fragment>
                );
              })}
              {!loading && query && results.length === 0 && <p className="text-center">No results found.</p>}
              {!query && (
                <div className="text-center">
                  <img src="/movie.svg" alt="Search" className="w-75 mt-5 mb-4" />
                  <p className="text-secondary">Search movies, people, or TV shows</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer border-0"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
