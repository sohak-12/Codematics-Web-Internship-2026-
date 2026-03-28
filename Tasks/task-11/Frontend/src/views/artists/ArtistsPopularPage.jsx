import React from 'react';
import usePageTitle from '../../lib/metadata';
import ArtistsGrid from '../../components/catalog/artists/ArtistsGrid';
const ArtistsPopularPage = () => { usePageTitle('Popular People'); return <section><ArtistsGrid /></section>; };
export default ArtistsPopularPage;
