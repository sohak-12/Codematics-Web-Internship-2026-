import ContentGrid from '../../shared/ContentGrid';
import { getUpcomingMovies } from '../../../api/tmdbClient';
const FilmsAllUpcoming = () => <ContentGrid fetchFn={getUpcomingMovies} mediaType="movie" cacheKey="filmsUpcoming" />;
export default FilmsAllUpcoming;
