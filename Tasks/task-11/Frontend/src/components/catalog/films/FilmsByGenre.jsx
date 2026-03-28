import GenreExplorer from '../../shared/GenreExplorer';
import { getMovieGenres, getMoviesByGenre } from '../../../api/tmdbClient';
const FilmsByGenre = () => <GenreExplorer fetchByGenre={getMoviesByGenre} fetchGenres={getMovieGenres} mediaType="movie" cacheKey="Films" detailPath="/movies" />;
export default FilmsByGenre;
