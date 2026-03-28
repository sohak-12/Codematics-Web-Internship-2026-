import React from 'react';
import usePageTitle from '../../lib/metadata';
import ShowsAllPopular from '../../components/catalog/shows/ShowsAllPopular';
const ShowsPopularPage = () => { usePageTitle('Popular TV Shows'); return <section><ShowsAllPopular /></section>; };
export default ShowsPopularPage;
