import ContentGrid from '../../shared/ContentGrid';
import { getPopularShows } from '../../../api/tmdbClient';
const ShowsAllPopular = () => <ContentGrid fetchFn={getPopularShows} mediaType="tv" cacheKey="showsPopular" />;
export default ShowsAllPopular;
