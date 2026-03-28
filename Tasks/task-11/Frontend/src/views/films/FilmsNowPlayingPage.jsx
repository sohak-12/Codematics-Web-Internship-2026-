import React from 'react';
import usePageTitle from '../../lib/metadata';
import FilmsAllNowPlaying from '../../components/catalog/films/FilmsAllNowPlaying';
const FilmsNowPlayingPage = () => { usePageTitle('Now Playing'); return <section><FilmsAllNowPlaying /></section>; };
export default FilmsNowPlayingPage;
