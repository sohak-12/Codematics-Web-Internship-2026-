import ContentGrid from '../../shared/ContentGrid';
import { getTopRatedShows } from '../../../api/tmdbClient';
const ShowsAllTopRated = () => <ContentGrid fetchFn={getTopRatedShows} mediaType="tv" cacheKey="showsTopRated" />;
export default ShowsAllTopRated;
