import ContentGrid from '../../shared/ContentGrid';
import { getTopRatedMovies } from '../../../api/tmdbClient';
const FilmsAllTopRated = () => <ContentGrid fetchFn={getTopRatedMovies} mediaType="movie" cacheKey="filmsTopRated" />;
export default FilmsAllTopRated;
