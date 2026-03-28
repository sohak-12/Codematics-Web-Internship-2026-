import ContentGrid from '../../shared/ContentGrid';
import { getShowsOnAir } from '../../../api/tmdbClient';
const ShowsAllOnAir = () => <ContentGrid fetchFn={getShowsOnAir} mediaType="tv" cacheKey="showsOnAir" />;
export default ShowsAllOnAir;
