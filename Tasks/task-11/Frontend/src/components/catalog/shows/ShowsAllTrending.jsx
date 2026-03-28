import ContentGrid from '../../shared/ContentGrid';
import { getTrendingShows } from '../../../api/tmdbClient';
const ShowsAllTrending = () => <ContentGrid fetchFn={getTrendingShows} mediaType="tv" cacheKey="showsTrending" />;
export default ShowsAllTrending;
