import React from 'react';
import usePageTitle from '../../lib/metadata';
import ShowsAllOnAir from '../../components/catalog/shows/ShowsAllOnAir';
const ShowsOnAirPage = () => { usePageTitle('TV Shows On The Air'); return <section><ShowsAllOnAir /></section>; };
export default ShowsOnAirPage;
