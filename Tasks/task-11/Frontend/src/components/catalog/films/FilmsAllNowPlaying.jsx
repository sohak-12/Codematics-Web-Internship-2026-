import ContentGrid from '../../shared/ContentGrid';
import { getNowPlayingMovies } from '../../../api/tmdbClient';
const FilmsAllNowPlaying = () => <ContentGrid fetchFn={getNowPlayingMovies} mediaType="movie" cacheKey="filmsNowPlaying" />;
export default FilmsAllNowPlaying;
