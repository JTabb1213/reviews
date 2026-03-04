# 🍽️ Restaurant Reviews

A full-stack web application that lets users discover nearby restaurants powered by the Google Places API, leave star-rated reviews, and manage their own submissions — all behind a session-authenticated backend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Backend](#backend)
  - [Service / Provider Pattern](#service--provider-pattern)
  - [API Endpoints](#api-endpoints)
  - [Database (PostgreSQL + Sequelize)](#database-postgresql--sequelize)
  - [Session Cache (Redis)](#session-cache-redis)
  - [Google Places API Integration](#google-places-api-integration)
- [Deployment](#deployment)
  - [Frontend → Firebase Hosting](#frontend--firebase-hosting)
  - [Backend → Google Cloud Run](#backend--google-cloud-run)
  - [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Environment Variables](#environment-variables)
- [Design Choices](#design-choices)

---

## Overview

Users can:
- Search for restaurants by name and location (or use GPS "my location")
- View restaurant details and photos fetched live from Google Places
- Read user-submitted reviews sorted newest-first with star ratings and emoji reactions
- Register / log in / log out
- Post a review for any restaurant
- Delete their own review

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, React Router v6, MUI (Grid) |
| Backend | Node.js, Express |
| Database | PostgreSQL via Sequelize ORM |
| Session Store | Redis (Upstash-compatible, TLS) |
| External APIs | Google Places API (Nearby Search, Place Details, Photos) |
| Frontend Hosting | Firebase Hosting |
| Backend Hosting | Google Cloud Run (Dockerized) |
| CI/CD | GitHub Actions |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│          React SPA (Firebase Hosting / CDN)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTPS (axios, withCredentials)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│           Firebase Hosting (reverse proxy)                  │
│    rewrites /api/** → Cloud Run backend                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Express API  (Cloud Run)                       │
│                                                             │
│   ┌─────────────┐   ┌──────────────┐   ┌───────────────┐    │
│   │  Session    │   │   Services   │   │  Google       │    │
│   │  Middleware │   │  (business   │   │  Places API   │    │
│   │  (Redis)    │   │   logic)     │   │               │    │
│   └─────────────┘   └──────┬───────┘   └───────────────┘    │
│                             │                               │
│                      ┌──────▼───────┐                       │
│                      │  Providers   │                       │
│                      │  (DB / API)  │                       │
│                      └──────┬───────┘                       │
└─────────────────────────────┼───────────────────────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
  ┌─────────────────┐               ┌─────────────────────┐
  │   PostgreSQL    │               │   Redis (Upstash)   │
  │   (reviews,     │               │   session store     │
  │    users)       │               └─────────────────────┘
  └─────────────────┘
```

---

## Frontend

Located in `frontend1/src/`.

### Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | `SearchPage` | Search restaurants by name + location; shows average community rating per result |
| `/displaypage?id=<placeId>` | `DisplayPage` | Restaurant detail: photos, all reviews, add/delete review button |
| `/reviewpage?id=<placeId>` | `ReviewPage` | Submit a star-rated review with text and emoji shortcuts |
| `/loginpage` | `LoginPage` | Username / password login |
| `/register` | `RegisterPage` | Create a new account |
| `/logoutpage` | `LogoutPage` | Destroys session and redirects |
| `/needtologin` | `BadLoginPage` | Shown when an unauthenticated user tries a protected action |

### Key Design Choices

**Centralised HTTP client (`HttpClient.tsx`)**  
All requests go through a single `useHttpClient()` hook that creates an Axios instance pre-configured with `baseURL`, `withCredentials: true` (so session cookies travel on every request), and request/response interceptors for console logging. This makes it trivial to add auth headers or error handling globally later.

**Average rating computed on the client**  
On the Search page, after the Google Places results come back, the frontend fetches the stored reviews for *each* result in parallel and computes an average rating locally. This keeps the backend simple and makes the average reflect only user-submitted data, not Google's own ratings.

**Geolocation-aware search**  
When "my location" is typed (or left as the default), the browser's `navigator.geolocation` API is used to get real GPS coordinates which are forwarded to the backend. This avoids storing or geocoding a city name and gives accurate nearby results.

---

## Backend

Located in `backend2/`.

### Service / Provider Pattern

The backend is intentionally structured so that **every capability is a service, and every service is backed by a swappable provider**:

```
services/
  restaurants/
    index.js          ← public API consumed by server.js
    providers/
      googleRestaurants.js   ← real implementation
  reviews/
    index.js
    providers/
      database.js    ← Sequelize / Postgres
  getReviews/
    index.js
    providers/
      db.js
  restaurantById/
    index.js
    providers/
      google.js
  photos/
    index.js
    providers/
      googleAPIPhoto.js
  location/
    index.js
    providers/
      googleAPI.js
```

The `index.js` in each service reads the active provider from `config/default.json` and delegates all method calls with `_delegate.method.apply(_delegate, arguments)`. **This means you can swap out, say, the Google Places backend for a mock or a different data source by changing one line in config** — `server.js` never needs to know.

This pattern also makes unit testing each service trivial: mock the provider, not the HTTP layer.

### API Endpoints

| Method | Path | Auth required | Description |
|---|---|---|---|
| GET | `/api/hello` | No | Health check |
| GET | `/api/restaurantsNearby` | No | Nearby restaurant search via Google Places |
| GET | `/api/searchByGoogleId` | No | Full Place Details by `place_id` |
| GET | `/api/getPhotos` | No | Constructs a Google Places Photo URL |
| GET | `/api/getResReviews` | No | All stored reviews for a restaurant |
| POST | `/api/postReview` | No* | Submit a review |
| GET | `/api/searchUserRev` | No* | Check whether a user has a review for a restaurant |
| DELETE | `/api/deleteRev` | No* | Delete a user's review |
| POST | `/api/seeIfLoggedIn` | No | Returns 401 if no session |
| GET | `/api/userinfo` | Yes | Returns `{ username }` from session |
| POST | `/api/login` | No | Authenticate and create session |
| POST | `/api/logout` | No | Destroy session |
| POST | `/api/createUser` | No | Register a new account |
| GET | `/api/debug-session` | No | Dev helper: dump session |

> \* These endpoints use the username from the request body/query, so they work without session middleware — but you would want to add the `isLoggedIn` middleware in a future hardening pass.

### Database (PostgreSQL + Sequelize)

Two tables, defined in `models/`:

**users**
```sql
CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  username  VARCHAR(255) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  email     VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL,
  updatedAt TIMESTAMPTZ NOT NULL
);
```

**reviews**
```sql
CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  rating        DECIMAL,
  review_text   VARCHAR(255),
  user_id       VARCHAR(255),
  restaurant_id VARCHAR(255),
  createdAt     TIMESTAMPTZ NOT NULL,
  updatedAt     TIMESTAMPTZ NOT NULL
);
```

`restaurant_id` stores the Google `place_id` string rather than a foreign key into a local restaurants table. **This was a deliberate choice**: restaurants are sourced live from Google and never persisted, so only the reviews need to be stored. Keying off `place_id` means no sync job is needed to keep a local restaurants table up-to-date.

Sequelize connection config comes entirely from environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) so credentials never appear in source code.

### Session Cache (Redis)

Express sessions are stored in Redis via `connect-redis`. This was chosen instead of in-memory sessions for two reasons:

1. **Cloud Run scales to zero and can run multiple instances.** An in-memory session store would lose sessions on cold starts and fail in a multi-instance setup. Redis is external and shared across all instances.
2. **Upstash Redis** (a serverless Redis provider) is used, which is free-tier friendly and connects over TLS (`rediss://`). The connection URL is assembled from `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, and `REDIS_PASSWORD` environment variables.

Key session config decisions:
- **Cookie named `__session`** — Firebase Hosting's CDN strips *every* cookie except `__session` before forwarding to Cloud Run. Using any other name would silently break login across the Firebase proxy.
- **`sameSite: 'None'` + `secure: true` in production** — The frontend (Firebase Hosting domain) and backend (Cloud Run domain) are cross-origin in prod, so the cookie must be `SameSite=None; Secure` to be sent on cross-origin credentialed requests.
- **Session key prefix `reviewsApp:sess:`** — Namespaces all session keys in Redis so this app never collides with other apps using the same Redis instance.

### Google Places API Integration

Three Google Places endpoints are used:

| Feature | Google API | Backend service |
|---|---|---|
| Nearby restaurant search | Places Nearby Search | `services/restaurants` |
| Restaurant detail + photos list | Place Details | `services/restaurantById` |
| Photo URL construction | Places Photo | `services/photos` |

The photo service doesn't proxy the image — it constructs the direct Google CDN URL and returns it to the frontend, which renders it in an `<img>` tag directly. This avoids streaming large image bytes through Cloud Run and keeps photo loading fast and cheap.

For location, the `services/location` service geocodes a city name to lat/lng via the Google Geocoding API. When the user chooses "my location", the browser GPS coordinates are forwarded directly and the geocoding step is skipped.

---

## Deployment

### Frontend → Firebase Hosting

The React app is built with `react-scripts build` (CRA) and the `build/` output is deployed to Firebase Hosting. Firebase serves the static assets from its global CDN and rewrites any `/api/**` path to the Cloud Run backend service. This means the browser always talks to the same origin for both the SPA and the API, which simplifies CORS.

### Backend → Google Cloud Run

The Express server is packaged in a Docker container (`backend2/Dockerfile`) and deployed to **Google Cloud Run**. Cloud Run was chosen because:
- It is serverless — zero cost when idle, auto-scales under load.
- It accepts a plain `PORT` environment variable (Express listens on `process.env.PORT || 80`).
- It integrates cleanly with Google Artifact Registry for container storage.

### CI/CD with GitHub Actions

Two workflows live in `.github/workflows/`:

**`deploy-frontend.yml`** — triggers on pushes to `main` that touch `frontend1/**`:
1. `npm ci` — install exact locked dependencies
2. `npm run build` — CRA production build (CI mode: warnings = errors)
3. `FirebaseExtended/action-hosting-deploy@v0` — deploy to Firebase live channel

**`deploy-backend.yml`** — triggers on pushes to `main` that touch `backend2/**`:
1. Authenticate to GCP with a service-account JSON key secret
2. `docker build` → push to **Artifact Registry** (tagged with the commit SHA for traceability)
3. `google-github-actions/deploy-cloudrun@v2` — deploy the new image to Cloud Run with all secrets forwarded as environment variables

Path filters on both workflows mean a backend-only change doesn't rebuild the frontend, and vice versa — keeping CI fast.

---

## Environment Variables

### Backend (set as GitHub secrets → Cloud Run env vars)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `production` in Cloud Run |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port (usually 6380 for TLS) |
| `REDIS_USERNAME` | Redis ACL username |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_URL` | Optional full `rediss://` URL (overrides individual vars) |
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Postgres database name |
| `GOOGLE_API_KEY` | Google Places + Geocoding API key |
| `CORS_ORIGINS` | Comma-separated allowed origins (e.g. `https://your-app.web.app`) |

### Frontend (build-time)

The frontend reads `AppProps.backend` from `src/AppProps.tsx` for the Axios base URL. Update this file to point to your Cloud Run service URL before deploying.

---

## Design Choices

| Decision | Rationale |
|---|---|
| **React SPA over SSR** | The app is mostly client-driven (geolocation, dynamic rating aggregation). SSR would add complexity with no meaningful SEO benefit for a review app behind auth. |
| **Google `place_id` as primary key for reviews** | Avoids maintaining a local restaurants table. Reviews are the only data that needs persistence; everything else is live from Google. |
| **Session-based auth over JWT** | Sessions stored in Redis are easy to invalidate server-side (e.g. force logout). JWTs are stateless and require a blocklist to invalidate, which defeats their simplicity. |
| **Redis for sessions (not DB)** | Sub-millisecond reads on every authenticated request. Using Postgres for sessions would add latency and unnecessary load on the primary database. |
| **Service/Provider abstraction** | Decouples business logic from implementation details. Swapping the map provider or moving from Google to another API requires changing one config value, not touching `server.js`. |
| **Cookie named `__session`** | Required by Firebase Hosting's CDN, which strips all other cookies before proxying to Cloud Run. |
| **`SameSite=None; Secure` in prod** | Firebase Hosting and Cloud Run have different domains; cross-origin credentialed cookies require these exact flags in modern browsers. |
| **Photos served as URLs, not proxied** | Returning a Google CDN URL instead of streaming image bytes through Cloud Run keeps the backend stateless, avoids egress costs, and is faster for the user. |
| **Path-scoped GitHub Actions** | `paths:` filters mean unrelated changes don't trigger unnecessary builds, keeping CI fast and minimising deployment risk. |
