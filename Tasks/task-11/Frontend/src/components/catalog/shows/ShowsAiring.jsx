import ContentCarousel from '../../shared/ContentCarousel';
import { getShowsAiringToday } from '../../../api/tmdbClient';
const ShowsAiring = () => <ContentCarousel title="TV Shows Airing Today" link="/tv-shows/airing-today" fetchFn={getShowsAiringToday} mediaType="tv" />;
export default ShowsAiring;
