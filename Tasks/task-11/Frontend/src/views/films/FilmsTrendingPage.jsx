import React from 'react';
import usePageTitle from '../../lib/metadata';
import FilmsAllTrending from '../../components/catalog/films/FilmsAllTrending';
const FilmsTrendingPage = () => { usePageTitle('Trending'); return <section><FilmsAllTrending /></section>; };
export default FilmsTrendingPage;
