import ContentCarousel from '../../shared/ContentCarousel';
import { getUpcomingMovies } from '../../../api/tmdbClient';
const FilmsUpcoming = () => <ContentCarousel title="Upcoming Movies" link="/movies/upcoming" fetchFn={getUpcomingMovies} mediaType="movie" />;
export default FilmsUpcoming;
