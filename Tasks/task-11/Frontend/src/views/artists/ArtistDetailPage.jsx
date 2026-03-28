import React from 'react';
import { useParams } from 'react-router-dom';
import ArtistProfile from '../../components/catalog/artists/ArtistProfile';
const ArtistDetailPage = () => { const { personId } = useParams(); return <section><ArtistProfile personId={personId} /></section>; };
export default ArtistDetailPage;
