import ContentCarousel from '../../shared/ContentCarousel';
import { getTrendingShows } from '../../../api/tmdbClient';
const ShowsTrending = () => <ContentCarousel title="Trending TV Shows" link="/tv-shows/trending" fetchFn={getTrendingShows} mediaType="tv" />;
export default ShowsTrending;
