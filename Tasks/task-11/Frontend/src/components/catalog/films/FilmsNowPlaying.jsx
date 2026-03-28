import ContentCarousel from '../../shared/ContentCarousel';
import { getNowPlayingMovies } from '../../../api/tmdbClient';
const FilmsNowPlaying = () => <ContentCarousel title="Now Playing in Theaters" link="/movies/now-playing" fetchFn={getNowPlayingMovies} mediaType="movie" />;
export default FilmsNowPlaying;
