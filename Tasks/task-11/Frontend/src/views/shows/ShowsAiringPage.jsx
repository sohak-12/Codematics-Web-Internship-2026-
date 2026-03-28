import React from 'react';
import usePageTitle from '../../lib/metadata';
import ShowsAllAiring from '../../components/catalog/shows/ShowsAllAiring';
const ShowsAiringPage = () => { usePageTitle('TV Shows Airing Today'); return <section><ShowsAllAiring /></section>; };
export default ShowsAiringPage;
