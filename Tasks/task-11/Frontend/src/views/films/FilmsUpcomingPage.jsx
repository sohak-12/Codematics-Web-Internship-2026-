import React from 'react';
import usePageTitle from '../../lib/metadata';
import FilmsAllUpcoming from '../../components/catalog/films/FilmsAllUpcoming';
const FilmsUpcomingPage = () => { usePageTitle('Upcoming'); return <section><FilmsAllUpcoming /></section>; };
export default FilmsUpcomingPage;
