import React from 'react';
import usePageTitle from '../../lib/metadata';
import FilmsAllPopular from '../../components/catalog/films/FilmsAllPopular';
const FilmsPopularPage = () => { usePageTitle('Popular'); return <section><FilmsAllPopular /></section>; };
export default FilmsPopularPage;
