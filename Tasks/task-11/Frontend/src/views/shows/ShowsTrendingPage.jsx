import React from 'react';
import usePageTitle from '../../lib/metadata';
import ShowsAllTrending from '../../components/catalog/shows/ShowsAllTrending';
const ShowsTrendingPage = () => { usePageTitle('Trending TV Shows'); return <section><ShowsAllTrending /></section>; };
export default ShowsTrendingPage;
