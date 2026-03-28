import React from 'react';
import usePageTitle from '../../lib/metadata';
import FilmsAllTopRated from '../../components/catalog/films/FilmsAllTopRated';
const FilmsTopRatedPage = () => { usePageTitle('Top Rated Movies'); return <section><FilmsAllTopRated /></section>; };
export default FilmsTopRatedPage;
