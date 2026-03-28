import ContentCarousel from '../../shared/ContentCarousel';
import { getTopRatedShows } from '../../../api/tmdbClient';
const ShowsTopRated = () => <ContentCarousel title="Top Rated TV Shows" link="/tv-shows/top-rated" fetchFn={getTopRatedShows} mediaType="tv" />;
export default ShowsTopRated;
