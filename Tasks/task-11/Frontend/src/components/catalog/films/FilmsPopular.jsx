import ContentCarousel from '../../shared/ContentCarousel';
import { getPopularMovies } from '../../../api/tmdbClient';
const FilmsPopular = () => <ContentCarousel title="Popular Movies" link="/movies/popular" fetchFn={getPopularMovies} mediaType="movie" />;
export default FilmsPopular;
