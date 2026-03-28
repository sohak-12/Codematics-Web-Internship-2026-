import axios from 'axios';

const http = axios.create({ baseURL: '/api' });

const safeGet = async (url, params) => {
  try { return (await http.get(url, { params })).data; }
  catch { return null; }
};

// Movies
export const getMovieTrailers = (id) => safeGet(`/movie-trailer/${id}`);
export const getMovieGenres = () => safeGet('/movie-genres');
export const getMoviesByGenre = (genreId, page = 1) => safeGet(`/movies/genre/${genreId}`, { page });
export const getPopularMovies = (page) => safeGet('/popular-movies', { page });
export const getTrendingMovies = (page) => safeGet('/trending-movies', { page });
export const getUpcomingMovies = (page) => safeGet('/upcoming-movies', { page });
export const getNowPlayingMovies = (page) => safeGet('/now-playing-movies', { page });
export const getTopRatedMovies = (page) => safeGet('/top-rated-movies', { page });
export const getMovieById = (id) => safeGet(`/movie/${id}`);
export const getMovieCredits = (id) => safeGet(`/movie/${id}/credits`);
export const getSimilarMovies = (id) => safeGet(`/movie/${id}/similar`);
export const getMovieRecommendations = (id) => safeGet(`/movie/${id}/recommendations`);
export const getMovieReviews = (id) => safeGet(`/movie/${id}/reviews`);

// TV Shows
export const getTVTrailers = (id) => safeGet(`/tv-trailer/${id}`);
export const getTVGenres = () => safeGet('/tv-genres');
export const getTVShowsByGenre = (genreId, page = 1) => safeGet(`/tvshows/genre/${genreId}`, { page });
export const getTrendingShows = (page) => safeGet('/trending-tv', { page });
export const getShowsAiringToday = (page = 1) => safeGet('/tvshows/airing-today', { page });
export const getShowsOnAir = (page = 1) => safeGet('/tvshows/on-the-air', { page });
export const getPopularShows = (page = 1) => safeGet('/tvshows/popular', { page });
export const getTopRatedShows = (page = 1) => safeGet('/tvshows/top-rated', { page });
export const getShowById = (id) => safeGet(`/tv/${id}`);
export const getShowCredits = (id) => safeGet(`/tv/${id}/aggregate_credits`);
export const getShowExternalIds = (id) => safeGet(`/tv/${id}/external_ids`);
export const getSimilarShows = (id) => safeGet(`/tv/${id}/similar`);
export const getShowRecommendations = (id) => safeGet(`/tv/${id}/recommendations`);
export const getShowReviews = (id) => safeGet(`/tv/${id}/reviews`);

// People
export const getPopularPeople = (page = 1) => safeGet('/popular-people', { page });
export const getPersonById = (id) => safeGet(`/person/${id}`);
export const getPersonFilmCredits = (id) => safeGet(`/person/${id}/movie-credits`);
export const getPersonShowCredits = (id) => safeGet(`/person/${id}/tv-credits`);

// Search & Trending All
export const searchAll = async (query) => (await safeGet('/search', { query })) ?? { results: [] };
export const getTrendingAll = (page) => safeGet('/trending-all', { page });

// Discover with filters
export const discoverMovies = (params) => safeGet('/discover/movie', params);
export const discoverTV = (params) => safeGet('/discover/tv', params);
