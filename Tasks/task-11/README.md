# Task-11 — Primeflix: Movie & TV Show Streaming Platform

## Overview

A full-stack Netflix-inspired movie and TV show discovery platform built with React (Frontend) and Node.js/Express (Backend). Features Firebase Authentication 
(Google + Email/Password), Firestore watchlist, TMDB API integration with 40+ endpoints, dark/light theme, and PWA support.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Bootstrap 5, Vite 5 |
| Backend | Node.js, Express.js |
| Auth | Firebase Auth (Google OAuth + Email/Password) |
| Database | Firebase Firestore (Watchlist & User Data) |
| External API | TMDB (The Movie Database) API v3 |
| State | React Context API |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Performance | React LazyLoad, PWA (vite-plugin-pwa) |
| Deployment | Vercel (Frontend + Backend) |

---

## Project Structure

```
task-11/
├── Frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── logo.png
│   │   ├── logo192.png / logo512.png
│   │   ├── profile.png / profile.svg
│   │   ├── 404.svg / movie.svg / search.svg
│   │   ├── banner-person.webp
│   │   ├── default-poster.webp / default-backdrop.webp
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── api/                    # Axios API service layer
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthModal.jsx       # Login/Signup modal with toggle
│   │   │   │   ├── LandingPage.jsx     # Netflix-style landing (unauthenticated)
│   │   │   │   ├── LandingPage.css
│   │   │   │   ├── FavoriteButton.jsx  # Heart toggle for watchlist
│   │   │   │   └── UserMenu.jsx        # Profile dropdown menu
│   │   │   ├── catalog/
│   │   │   │   ├── artists/        # Artist card components
│   │   │   │   ├── films/          # Movie card components
│   │   │   │   ├── previews/       # Preview/trailer components
│   │   │   │   └── shows/          # TV show card components
│   │   │   ├── feedback/
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ContentPlaceholder.jsx
│   │   │   │   ├── MediaCard.jsx       # Universal media card
│   │   │   │   ├── PaginateButton.jsx
│   │   │   │   ├── ExpandableText.jsx
│   │   │   │   ├── ScrollTop.jsx
│   │   │   │   └── ViewMoreCard.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AppHeader.jsx       # Top navigation bar
│   │   │   │   ├── AppNavbar.jsx       # Mobile bottom nav
│   │   │   │   ├── AppFooter.jsx
│   │   │   │   ├── SearchOverlay.jsx   # Full-screen search modal
│   │   │   │   ├── ThemeSwitcher.jsx   # Dark/Light toggle
│   │   │   │   ├── ScrollGuard.jsx     # Scroll restoration
│   │   │   │   ├── Section.jsx
│   │   │   │   └── PageTitle.jsx
│   │   │   ├── media/
│   │   │   │   ├── MovieDetails.jsx    # Full movie detail view
│   │   │   │   ├── ShowDetails.jsx     # Full TV show detail view
│   │   │   │   └── CrewSection.jsx     # Cast & crew display
│   │   │   └── shared/
│   │   │       ├── ContentCarousel.jsx # Horizontal scroll carousel
│   │   │       ├── ContentGrid.jsx     # Responsive grid layout
│   │   │       ├── GenreExplorer.jsx   # Genre browsing component
│   │   │       ├── ReviewSection.jsx   # User reviews display
│   │   │       └── SimilarContent.jsx  # Related content suggestions
│   │   ├── composables/            # Reusable logic hooks
│   │   ├── config/
│   │   │   └── firebase.js         # Firebase init (Auth + Firestore)
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state, login, register, watchlist
│   │   ├── lib/                    # Utility libraries
│   │   ├── views/
│   │   │   ├── films/
│   │   │   │   ├── FilmsIndex.jsx
│   │   │   │   ├── FilmDetailPage.jsx
│   │   │   │   ├── FilmsGenrePage.jsx
│   │   │   │   ├── FilmsTrendingPage.jsx
│   │   │   │   ├── FilmsPopularPage.jsx
│   │   │   │   ├── FilmsNowPlayingPage.jsx
│   │   │   │   ├── FilmsTopRatedPage.jsx
│   │   │   │   └── FilmsUpcomingPage.jsx
│   │   │   ├── shows/
│   │   │   │   ├── ShowsIndex.jsx
│   │   │   │   ├── ShowDetailPage.jsx
│   │   │   │   ├── ShowsGenrePage.jsx
│   │   │   │   ├── ShowsTrendingPage.jsx
│   │   │   │   ├── ShowsPopularPage.jsx
│   │   │   │   ├── ShowsTopRatedPage.jsx
│   │   │   │   ├── ShowsAiringPage.jsx
│   │   │   │   └── ShowsOnAirPage.jsx
│   │   │   ├── artists/
│   │   │   │   ├── ArtistsPopularPage.jsx
│   │   │   │   └── ArtistDetailPage.jsx
│   │   │   ├── HomePage.jsx        # Main dashboard with carousels
│   │   │   ├── WatchlistPage.jsx   # User's saved favorites
│   │   │   ├── NotFoundPage.jsx    # Custom 404
│   │   │   └── index.js            # View exports
│   │   ├── App.jsx                 # Root: routing, auth gate, landing
│   │   ├── main.jsx                # Entry point
│   │   └── styles.css              # Global styles with CSS variables
│   ├── package.json
│   ├── vite.config.js              # Vite + PWA plugin config
│   └── vercel.json
│
└── Backend/
    ├── index.js                    # Express server with 40+ TMDB proxy endpoints
    ├── package.json
    ├── vercel.json
    └── .env                        # TMDB_API_KEY
```

---

## Pages & Features

### Landing Page (Unauthenticated)
- Netflix-style cinematic landing page with hero section
- Gradient overlays and call-to-action buttons
- Google Sign-In button for quick access
- Login/Signup modal trigger
- Forced dark theme for cinematic feel
- Custom CSS animations and floating elements

### Auth Modal
- Login and Signup toggle in single modal
- Email/Password registration with email verification
- Google OAuth one-click sign-in
- Form validation with React Hook Form
- Error handling with toast notifications
- Resend verification email option

### Home Page (`/`)
- Trending movies, popular movies, now playing — all in horizontal carousels
- TV shows section with trending and popular
- Popular people carousel
- Each card links to its detail page
- Smooth horizontal scrolling with navigation arrows

### Movies Section (`/movies/*`)
- **Movies Index** — Browse all movies by category with genre explorer
- **Movie Detail** — Backdrop image, poster, rating, runtime, genres, overview, tagline, cast carousel, crew section, YouTube trailer embed, user reviews,
                     similar movies, recommended movies
- **Trending** — Weekly trending movies with pagination
- **Popular** — Most popular movies with load more
- **Now Playing** — Currently in theaters
- **Top Rated** — Highest rated movies of all time
- **Upcoming** — Movies coming soon
- **By Genre** — Filter movies by genre category

### TV Shows Section (`/tv-shows/*`)
- **Shows Index** — Browse all TV shows by category
- **Show Detail** — Full show info, seasons, episodes count, aggregate cast credits, external links (IMDb), trailers, reviews, similar shows, recommended shows
- **Trending** — Weekly trending shows
- **Popular** — Most watched shows
- **Top Rated** — Highest rated shows
- **Airing Today** — Shows airing today
- **On The Air** — Currently airing shows
- **By Genre** — Filter shows by genre

### People Section (`/people/*`)
- **Popular People** — Grid of popular actors, directors, creators with pagination
- **Person Detail** — Biography, personal info, movie filmography (cast + crew), TV show filmography, expandable biography text

### Search
- Full-screen search overlay modal
- Multi-search across movies, TV shows, and people simultaneously
- Real-time results with safe content filtering
- Click result to navigate to detail page

### Watchlist (`/watchlist`)
- Add/remove movies and TV shows via heart button
- Watchlist stored in Firebase Firestore (persists across devices)
- Dedicated page showing all saved content
- Favorite state synced in real-time

### Theme System
- Dark/Light mode toggle via ThemeSwitcher
- CSS custom properties for all colors
- Theme persists in localStorage
- Smooth transition between themes

### Content Safety
- All API requests include `include_adult: false`
- Server-side `filterSafe()` removes adult content from all responses
- Adult content blocked on detail pages (403 response)

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- Backend running (local or deployed)
- Firebase Project (Auth + Firestore enabled)

### Install & Run

```bash
cd Frontend
npm install
npm run dev      # runs on http://localhost:5173
```

### Environment Variables

Create a `.env` file in `Frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Build for Production

```bash
npm run build
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Backend Setup

### Prerequisites
- Node.js 18+
- TMDB API Key (from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Install & Run

```bash
cd Backend
npm install
npm start        # runs on http://localhost:5001
```

### Environment Variables

Create a `.env` file in `Backend/`:

```env
TMDB_API_KEY=your_tmdb_api_key
PORT=5001
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server with node |

---

## API Endpoints

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trending-movies` | Trending movies this week |
| GET | `/api/popular-movies` | Popular movies |
| GET | `/api/now-playing-movies` | Now playing in theaters |
| GET | `/api/upcoming-movies` | Upcoming movies |
| GET | `/api/top-rated-movies` | Top rated movies |
| GET | `/api/movie-genres` | All movie genres |
| GET | `/api/movies/genre/:genreId` | Movies by genre |
| GET | `/api/movie/:id` | Movie details |
| GET | `/api/movie/:id/credits` | Movie cast & crew |
| GET | `/api/movie/:id/similar` | Similar movies |
| GET | `/api/movie/:id/recommendations` | Recommended movies |
| GET | `/api/movie/:id/reviews` | Movie reviews |
| GET | `/api/movie-trailer/:id` | Movie trailers |
| GET | `/api/discover/movie` | Discover movies (filters) |

### TV Shows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trending-tv` | Trending TV shows |
| GET | `/api/tvshows/popular` | Popular TV shows |
| GET | `/api/tvshows/top-rated` | Top rated shows |
| GET | `/api/tvshows/airing-today` | Airing today |
| GET | `/api/tvshows/on-the-air` | On the air |
| GET | `/api/tv-genres` | All TV genres |
| GET | `/api/tvshows/genre/:genreId` | TV shows by genre |
| GET | `/api/tv/:id` | TV show details |
| GET | `/api/tv/:id/aggregate_credits` | TV show cast |
| GET | `/api/tv/:id/external_ids` | External links |
| GET | `/api/tv/:id/similar` | Similar TV shows |
| GET | `/api/tv/:id/recommendations` | Recommended shows |
| GET | `/api/tv/:id/reviews` | TV show reviews |
| GET | `/api/tv-trailer/:id` | TV show trailers |
| GET | `/api/discover/tv` | Discover TV shows (filters) |

### People

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/popular-people` | Popular people |
| GET | `/api/person/:id` | Person details |
| GET | `/api/person/:id/movie-credits` | Person's movie credits |
| GET | `/api/person/:id/tv-credits` | Person's TV credits |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trending-all` | Trending all (movies, TV, people) |
| GET | `/api/search?query=` | Multi-search |

---

## Authentication Flow

1. User opens app → `onAuthStateChanged` checks Firebase auth state
2. Not logged in → Netflix-style landing page shown (dark theme forced)
3. User clicks Sign In → Auth modal opens (login/signup toggle)
4. Login with Email/Password or Google OAuth
5. On success → User data stored in Firestore, app renders full dashboard
6. Watchlist synced from Firestore on login
7. Sign out → Firebase `signOut()`, state cleared, landing page shown

---

## 🧠 What I Learned (The Journey)

Building this full-stack streaming platform was a deep dive into real-world application development. Here are the key challenges I overcame:

- **TMDB API Proxy Architecture** — Built 40+ backend endpoints as a secure proxy to TMDB API, learning how to structure a large REST API with reusable
                                    middleware (`fetchFromTMDB`, `filterSafe`, `withPage`).

- **Firebase Auth + Firestore Integration** — Mastered Firebase Authentication with multiple providers (Email + Google), email verification flow, and
                                              real-time Firestore operations for watchlist persistence across devices.

- **Content Safety Filtering** — Implemented multi-layer adult content filtering: API-level (`include_adult: false`), server-side array filtering
                                 (`filterSafe`), and detail-page blocking (403 on adult content).

- **Netflix-Style UI/UX** — Learned to build cinematic landing pages, horizontal content carousels with smooth scrolling, and responsive grid layouts
                            that adapt from mobile to desktop.

- **React Context for Global State** — Used Context API to manage auth state, user favorites, and watchlist across the entire app without Redux,
                                       keeping the architecture simple and maintainable.

- **PWA & Performance** — Configured Vite PWA plugin with service workers, implemented lazy loading for images and routes, and optimized bundle size
                          with code splitting.

- **Theme System** — Built a complete dark/light theme system using CSS custom properties with smooth transitions and localStorage persistence.

---

**Author:** Soha Muzammil — *Intern at Codematics*
