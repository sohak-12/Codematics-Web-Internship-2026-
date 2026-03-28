import ContentGrid from '../../shared/ContentGrid';
import { getTrendingMovies } from '../../../api/tmdbClient';
const FilmsAllTrending = () => <ContentGrid fetchFn={getTrendingMovies} mediaType="movie" cacheKey="filmsTrending" />;
export default FilmsAllTrending;
