import ContentCarousel from '../../shared/ContentCarousel';
import { getPopularShows } from '../../../api/tmdbClient';
const ShowsPopular = () => <ContentCarousel title="Popular TV Shows" link="/tv-shows/popular" fetchFn={getPopularShows} mediaType="tv" />;
export default ShowsPopular;
