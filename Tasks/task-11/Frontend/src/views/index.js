import { lazy } from 'react';

const Home = lazy(() => import('./HomePage'));
const NotFound = lazy(() => import('./NotFoundPage'));
const Watchlist = lazy(() => import('./WatchlistPage'));

const Films = {
  Index: lazy(() => import('./films/FilmsIndex')),
  Upcoming: lazy(() => import('./films/FilmsUpcomingPage')),
  Trending: lazy(() => import('./films/FilmsTrendingPage')),
  Popular: lazy(() => import('./films/FilmsPopularPage')),
  NowPlaying: lazy(() => import('./films/FilmsNowPlayingPage')),
  TopRated: lazy(() => import('./films/FilmsTopRatedPage')),
  ByGenre: lazy(() => import('./films/FilmsGenrePage')),
  Single: lazy(() => import('./films/FilmDetailPage')),
};

const Shows = {
  Index: lazy(() => import('./shows/ShowsIndex')),
  Trending: lazy(() => import('./shows/ShowsTrendingPage')),
  Popular: lazy(() => import('./shows/ShowsPopularPage')),
  TopRated: lazy(() => import('./shows/ShowsTopRatedPage')),
  AiringToday: lazy(() => import('./shows/ShowsAiringPage')),
  OnTheAir: lazy(() => import('./shows/ShowsOnAirPage')),
  ByGenre: lazy(() => import('./shows/ShowsGenrePage')),
  Single: lazy(() => import('./shows/ShowDetailPage')),
};

const Artists = {
  Popular: lazy(() => import('./artists/ArtistsPopularPage')),
  Person: lazy(() => import('./artists/ArtistDetailPage')),
};

export default { Home, NotFound, Watchlist, Films, Shows, Artists };
