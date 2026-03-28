import ContentCarousel from '../../shared/ContentCarousel';
import { getShowsOnAir } from '../../../api/tmdbClient';
const ShowsOnAir = () => <ContentCarousel title="TV Shows On The Air" link="/tv-shows/on-the-air" fetchFn={getShowsOnAir} mediaType="tv" />;
export default ShowsOnAir;
