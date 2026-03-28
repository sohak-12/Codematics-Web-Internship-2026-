import React from 'react';
import usePageTitle from '../../lib/metadata';
import ShowsAllTopRated from '../../components/catalog/shows/ShowsAllTopRated';
const ShowsTopRatedPage = () => { usePageTitle('Top Rated TV Shows'); return <section><ShowsAllTopRated /></section>; };
export default ShowsTopRatedPage;
