import ContentGrid from '../../shared/ContentGrid';
import { getPopularMovies } from '../../../api/tmdbClient';
const FilmsAllPopular = () => <ContentGrid fetchFn={getPopularMovies} mediaType="movie" cacheKey="filmsPopular" />;
export default FilmsAllPopular;
