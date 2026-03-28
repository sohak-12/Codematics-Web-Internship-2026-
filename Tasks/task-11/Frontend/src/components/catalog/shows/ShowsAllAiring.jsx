import ContentGrid from '../../shared/ContentGrid';
import { getShowsAiringToday } from '../../../api/tmdbClient';
const ShowsAllAiring = () => <ContentGrid fetchFn={getShowsAiringToday} mediaType="tv" cacheKey="showsAiring" />;
export default ShowsAllAiring;
