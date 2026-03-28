import ContentCarousel from '../../shared/ContentCarousel';
import { getTopRatedMovies } from '../../../api/tmdbClient';
const FilmsTopRated = () => <ContentCarousel title="Top Rated Movies" link="/movies/top-rated" fetchFn={getTopRatedMovies} mediaType="movie" />;
export default FilmsTopRated;
