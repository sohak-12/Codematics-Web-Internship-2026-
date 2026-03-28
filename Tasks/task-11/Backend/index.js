const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
app.use(express.json());

// Always include_adult: false and filter results
const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      params: { api_key: API_KEY, language: 'en-US', include_adult: false, ...params },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
};

// Filter out any adult content from results array
const filterSafe = (results) => {
  if (!Array.isArray(results)) return results;
  return results.filter(item => !item.adult);
};

const withPage = (req, res, next) => { req.query.page = req.query.page || 1; next(); };

// ROOT
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Primeflix API is running' }));

// ============ MOVIES ============
app.get('/api/movie-trailer/:id', async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}/videos`); res.json(data.results || []); }
  catch { res.json([]); }
});

app.get('/api/movie-genres', async (req, res) => {
  try { const data = await fetchFromTMDB('/genre/movie/list'); res.json(data.genres); }
  catch { res.status(500).json({ error: 'Error fetching genres' }); }
});

app.get('/api/movies/genre/:genreId', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/discover/movie', { sort_by: 'popularity.desc', include_video: false, include_adult: false, page: req.query.page, with_genres: req.params.genreId });
    res.json(filterSafe(data.results));
  } catch { res.status(500).json({ error: 'Error fetching movies by genre' }); }
});

app.get('/api/upcoming-movies', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/movie/upcoming', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching upcoming movies' }); }
});

app.get('/api/popular-movies', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/movie/popular', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching popular movies' }); }
});

app.get('/api/trending-movies', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/trending/movie/week', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching trending movies' }); }
});

app.get('/api/now-playing-movies', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/movie/now_playing', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching now playing movies' }); }
});

app.get('/api/top-rated-movies', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/movie/top_rated', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching top rated movies' }); }
});

app.get('/api/movie/:id', async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}`); if (data.adult) return res.status(403).json({ error: 'Content not available' }); res.json(data); }
  catch { res.status(500).json({ error: 'Error fetching movie details' }); }
});

app.get('/api/movie/:id/credits', async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}/credits`); res.json(data); }
  catch { res.status(500).json({ error: 'Error fetching movie credits' }); }
});

app.get('/api/movie/:id/similar', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}/similar`, { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.json([]); }
});

app.get('/api/movie/:id/recommendations', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}/recommendations`, { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.json([]); }
});

app.get('/api/movie/:id/reviews', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/movie/${req.params.id}/reviews`, { page: req.query.page }); res.json(data.results || []); }
  catch { res.json([]); }
});

// ============ TV SHOWS ============
app.get('/api/tv-trailer/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/videos`);
    const filtered = (data.results || []).filter(v => v.site === 'YouTube' && v.official && ['Trailer', 'Teaser'].includes(v.type)).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    res.json(filtered);
  } catch { res.json([]); }
});

app.get('/api/tv-genres', async (req, res) => {
  try { const data = await fetchFromTMDB('/genre/tv/list'); res.json(data.genres); }
  catch { res.status(500).json({ error: 'Error fetching TV genres' }); }
});

app.get('/api/tvshows/genre/:genreId', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/discover/tv', { sort_by: 'popularity.desc', include_video: false, include_adult: false, page: req.query.page, with_genres: req.params.genreId });
    res.json(filterSafe(data.results));
  } catch { res.status(500).json({ error: 'Error fetching TV shows by genre' }); }
});

app.get('/api/trending-tv', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/trending/tv/week', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching trending TV shows' }); }
});

app.get('/api/tvshows/airing-today', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/tv/airing_today', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching TV shows airing today' }); }
});

app.get('/api/tvshows/on-the-air', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/tv/on_the_air', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching TV shows on the air' }); }
});

app.get('/api/tvshows/popular', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/tv/popular', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching popular TV shows' }); }
});

app.get('/api/tvshows/top-rated', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/tv/top_rated', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching top-rated TV shows' }); }
});

app.get('/api/tv/:id', async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}`); if (data.adult) return res.status(403).json({ error: 'Content not available' }); res.json(data); }
  catch { res.status(500).json({ error: 'Error fetching TV show data' }); }
});

app.get('/api/tv/:id/aggregate_credits', async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}/aggregate_credits`); res.json(data); }
  catch { res.status(500).json({ error: 'Error fetching TV show credits' }); }
});

app.get('/api/tv/:id/external_ids', async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}/external_ids`); res.json(data); }
  catch { res.status(500).json({ error: 'Error fetching external IDs' }); }
});

app.get('/api/tv/:id/similar', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}/similar`, { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.json([]); }
});

app.get('/api/tv/:id/recommendations', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}/recommendations`, { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.json([]); }
});

app.get('/api/tv/:id/reviews', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB(`/tv/${req.params.id}/reviews`, { page: req.query.page }); res.json(data.results || []); }
  catch { res.json([]); }
});

// ============ PEOPLE ============
app.get('/api/popular-people', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/person/popular', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching popular people' }); }
});

app.get('/api/person/:id', async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: 'Person ID is required' });
    const data = await fetchFromTMDB(`/person/${req.params.id}`);
    if (data.adult) return res.status(403).json({ error: 'Content not available' });
    res.json(data);
  } catch { res.status(500).json({ error: 'Error fetching person details' }); }
});

app.get('/api/person/:id/movie-credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/person/${req.params.id}/movie_credits`);
    if (data.cast) data.cast = filterSafe(data.cast);
    if (data.crew) data.crew = filterSafe(data.crew);
    res.json(data);
  } catch { res.status(500).json({ error: 'Error fetching movie credits' }); }
});

app.get('/api/person/:id/tv-credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/person/${req.params.id}/tv_credits`);
    if (data.cast) data.cast = filterSafe(data.cast);
    if (data.crew) data.crew = filterSafe(data.crew);
    res.json(data);
  } catch { res.status(500).json({ error: 'Error fetching TV credits' }); }
});

// ============ DISCOVER (with filters & sorting) ============
app.get('/api/discover/movie', withPage, async (req, res) => {
  try {
    const params = { page: req.query.page, include_adult: false, include_video: false };
    if (req.query.sort_by) params.sort_by = req.query.sort_by;
    if (req.query.with_genres) params.with_genres = req.query.with_genres;
    if (req.query.primary_release_year) params.primary_release_year = req.query.primary_release_year;
    if (req.query['vote_average.gte']) params['vote_average.gte'] = req.query['vote_average.gte'];
    if (req.query.with_original_language) params.with_original_language = req.query.with_original_language;
    const data = await fetchFromTMDB('/discover/movie', params);
    res.json({ results: filterSafe(data.results), total_pages: data.total_pages });
  } catch { res.status(500).json({ error: 'Error discovering movies' }); }
});

app.get('/api/discover/tv', withPage, async (req, res) => {
  try {
    const params = { page: req.query.page, include_adult: false };
    if (req.query.sort_by) params.sort_by = req.query.sort_by;
    if (req.query.with_genres) params.with_genres = req.query.with_genres;
    if (req.query.first_air_date_year) params.first_air_date_year = req.query.first_air_date_year;
    if (req.query['vote_average.gte']) params['vote_average.gte'] = req.query['vote_average.gte'];
    if (req.query.with_original_language) params.with_original_language = req.query.with_original_language;
    const data = await fetchFromTMDB('/discover/tv', params);
    res.json({ results: filterSafe(data.results), total_pages: data.total_pages });
  } catch { res.status(500).json({ error: 'Error discovering TV shows' }); }
});

// ============ SEARCH ============
app.get('/api/search', async (req, res) => {
  try {
    const data = await fetchFromTMDB('/search/multi', { query: req.query.query, include_adult: false });
    if (data.results) data.results = filterSafe(data.results);
    res.json(data);
  } catch { res.status(500).json({ error: 'Error searching' }); }
});

// ============ TRENDING ALL ============
app.get('/api/trending-all', withPage, async (req, res) => {
  try { const data = await fetchFromTMDB('/trending/all/week', { page: req.query.page }); res.json(filterSafe(data.results)); }
  catch { res.status(500).json({ error: 'Error fetching trending all' }); }
});

// LOCAL
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });
}

// VERCEL
module.exports = app;
