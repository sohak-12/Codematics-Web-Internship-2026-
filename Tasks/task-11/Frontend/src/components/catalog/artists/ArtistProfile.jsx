import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { getPersonById, getPersonFilmCredits, getPersonShowCredits } from '../../../api/tmdbClient';
import Section from '../../layout/Section';
import LoadingSpinner from '../../feedback/LoadingSpinner';
import ScrollTop from '../../feedback/ScrollTop';
import ExpandableText from '../../feedback/ExpandableText';
import { toFullDate, toShortDate, formatRating } from '../../../lib/formatters';
import { FaStar } from 'react-icons/fa';

const ArtistProfile = ({ personId }) => {
  const [person, setPerson] = useState(null);
  const [filmCredits, setFilmCredits] = useState([]);
  const [showCredits, setShowCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPersonById(personId);
        if (!data?.name) { navigate('/404'); return; }
        setPerson(data);
        const [mc, tc] = await Promise.all([getPersonFilmCredits(personId), getPersonShowCredits(personId)]);
        const sortByDate = (arr, key) => [...(arr.cast||[]), ...(arr.crew||[])].sort((a,b) => { if (!a[key]) return 1; if (!b[key]) return -1; return new Date(b[key]) - new Date(a[key]); });
        setFilmCredits(sortByDate(mc, 'release_date'));
        setShowCredits(sortByDate(tc, 'first_air_date'));
      } catch { navigate('/404'); } finally { setLoading(false); }
    };
    load();
  }, [personId, navigate]);

  useEffect(() => { if (person?.name) document.title = `PrimeFlix | ${person.name}`; }, [person]);

  if (loading) return <div className="d-flex justify-content-center pt-4 position-absolute top-50 start-50 translate-middle"><LoadingSpinner /></div>;
  if (!person) return <Section><p>Person details not found.</p></Section>;

  const bio = person.biography || '-';
  const isLong = bio.length > 200;
  const displayBio = expanded ? bio : bio.substring(0, 200);

  const CreditList = ({ credits, type }) => (
    <div className="row">
      {credits.length > 0 ? credits.map((c, i) => (
        <div key={`${c.id}-${type}-${i}`} className="col-lg-4 col-sm-6 my-sm-2 my-0">
          <div className="d-flex gap-3 justify-content-start align-items-start">
            <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.svg" alt="loading" className="credit-poster rounded-1" />}>
              <img className="credit-poster rounded-1" src={c.poster_path ? `https://image.tmdb.org/t/p/w200${c.poster_path}` : '/default-poster.svg'} alt={c.title || c.name || 'Poster'} />
            </LazyLoad>
            <div className="w-100">
              <div className="mb-2"><Link to={`/${type === 'film' ? 'movies' : 'tv-shows'}/${c.id}`} className="person-credit-link text fw-normal">{c.title || c.name} <span className="text-secondary">as</span> {c.job || c.character || '-'}</Link></div>
              <div className="d-flex gap-3 justify-content-sm-start justify-content-between align-items-center">
                <small className="text-secondary">{(c.release_date || c.first_air_date) ? toShortDate(c.release_date || c.first_air_date) : '-'}</small>
                <small className="text d-flex align-items-center"><FaStar className="text-yellow me-1" />{formatRating(c.vote_average)}</small>
              </div>
            </div>
          </div>
          <div className="hr d-sm-none"></div>
        </div>
      )) : <div className="text-sm-start text-center pt-3"><small className="text-secondary fst-italic">No {type} credits available.</small></div>}
    </div>
  );

  return (
    <Section>
      <div className="d-flex gap-4 justify-content-start align-items-start flex-column flex-md-row">
        <div className="person-img-wrapper w-100 mb-0">
          <LazyLoad height={200} offset={0} placeholder={<img src="/profile.svg" alt="loading" className="person-img rounded-4" />}>
            <img className="person-img rounded-4" src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.svg'} alt={person.name} />
          </LazyLoad>
        </div>
        <div className="w-100">
          <div className="d-flex justify-content-sm-start justify-content-between align-items-center gap-3 mb-4">
            <p className="h4 text fw-bold m-0">{person.name || '-'}</p>
            {person.imdb_id && <a href={`https://www.imdb.com/name/${person.imdb_id}/`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary border-0 rounded-5 py-1 px-3" style={{ whiteSpace: 'nowrap' }}>View on IMDb</a>}
          </div>
          <p className="text-secondary">Known for: <span className="text-tertiary">{person.known_for_department || '-'}</span></p>
          <p className="text-secondary">Birthday: <span className="text-tertiary">{person.birthday ? toFullDate(person.birthday) : '-'}</span></p>
          <p className="text-secondary">Place of Birth: <span className="text-tertiary">{person.place_of_birth || '-'}</span></p>
          {person.deathday && <p className="text-secondary">Date of Death: <span className="text-tertiary">{toFullDate(person.deathday)}</span></p>}
        </div>
      </div>
      {bio !== '-' && (
        <p className="card-text text-secondary lh-lg mt-md-3">Biography:
          <span className="text-tertiary ms-1">{displayBio}{isLong && !expanded && <span className="text-secondary">...</span>}{isLong && <ExpandableText isLong={isLong} expanded={expanded} onToggle={() => setExpanded(p => !p)} />}</span>
        </p>
      )}
      <div className="mt-4">
        <div className="sticky-top py-2">
          <ul className="nav nav-tabs d-flex justify-content-sm-start gap-3" id="credit-tabs" role="tablist">
            <li className="nav-item" role="presentation"><button className="nav-link tab py-3 bg-transparent fw-bold active" id="film-tab" data-bs-toggle="tab" data-bs-target="#film-credits" type="button" role="tab">Movie Credits</button></li>
            <li className="nav-item" role="presentation"><button className="nav-link tab py-3 fw-bold bg-transparent" id="show-tab" data-bs-toggle="tab" data-bs-target="#show-credits" type="button" role="tab">TV Credits</button></li>
          </ul>
        </div>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="film-credits" role="tabpanel"><CreditList credits={filmCredits} type="film" /></div>
          <div className="tab-pane fade" id="show-credits" role="tabpanel"><CreditList credits={showCredits} type="show" /></div>
        </div>
      </div>
      <ScrollTop />
    </Section>
  );
};

export default ArtistProfile;
