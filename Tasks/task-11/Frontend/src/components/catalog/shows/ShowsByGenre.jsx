import GenreExplorer from '../../shared/GenreExplorer';
import { getTVGenres, getTVShowsByGenre } from '../../../api/tmdbClient';
const ShowsByGenre = () => <GenreExplorer fetchByGenre={getTVShowsByGenre} fetchGenres={getTVGenres} mediaType="tv" cacheKey="Shows" detailPath="/tv-shows" />;
export default ShowsByGenre;
