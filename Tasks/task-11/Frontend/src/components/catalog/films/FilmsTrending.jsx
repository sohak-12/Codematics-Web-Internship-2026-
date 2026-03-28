import ContentCarousel from '../../shared/ContentCarousel';
import { getTrendingMovies } from '../../../api/tmdbClient';
const FilmsTrending = () => <ContentCarousel title="Trending Movies" link="/movies/trending" fetchFn={getTrendingMovies} mediaType="movie" />;
export default FilmsTrending;
