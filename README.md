## Overview

Ringing Ear solves a specificity problem: mainstream review platforms are too broad to surface meaningful consensus around underground rap. This app pulls real music data from the Spotify API, persists it locally, and builds a community rating and review layer on top of it. Scoped entirely to underground rap.

Users can search for any artist or album via Spotify, read community reviews, submit their own rating and written take, and see a live average score for each record.

---

## Features

- **Spotify-powered search** — search for artists and albums using the Spotify API; results are persisted to the local database on first lookup so the app builds its own catalogue over time
- **Community ratings** — each album displays an aggregate average score calculated from all user submissions
- **Written reviews** — users can write full reviews alongside their numeric rating
- **User accounts** — register and log in with JWT-based authentication; passwords hashed with bcrypt
- **Underground focus** — the specificity is intentional; the platform is built around a niche rather than trying to cover everything

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (`pg` Pool) |
| Auth | JWT, bcrypt |
| External API | Spotify Web API |

---

## Architecture

```
client/          # React + TypeScript (Vite)
  src/
    components/  # AlbumCard, ReviewForm, RatingDisplay, AuthForm, Nav
    context/     # AuthContext — JWT state, login/logout
    api.ts       # Axios instance with Bearer token interceptor

server/          # Express + TypeScript
  src/
    routes/      # auth, albums, reviews, search
    middleware/  # JWT auth guard
    db/          # PostgreSQL Pool connection + schema
    services/    # Spotify API client (token management, search, album fetch)
```

The backend acts as a proxy to Spotify. It handles OAuth client credentials flow internally, so API keys are never exposed to the client. Album data returned from Spotify is written to the local `albums` table on first request, decoupling the app from Spotify's rate limits on subsequent loads.

---

## Database Schema

```sql
users       -- id, username, email, password_hash, created_at
albums      -- spotify_id (PK), title, artist, image_url, release_year, cached_at
reviews     -- id, user_id → users, album_id → albums, rating (1–10), body, created_at
            -- UNIQUE(user_id, album_id) — one review per user per album
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- A [Spotify Developer](https://developer.spotify.com/dashboard) app (Client ID + Secret)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ringing-ear.git
cd ringing-ear

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Set up environment variables
cp server/.env.example server/.env
# Fill in: DATABASE_URL, JWT_SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET

# 4. Run the schema
psql -d your_db -f server/src/db/schema.sql

# 5. Start both servers
cd server && npm run dev   
cd client && npm run dev   
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ringing_ear
JWT_SECRET=your_jwt_secret
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
PORT=5000
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/search?q=` | — | Search Spotify + cache results |
| GET | `/api/albums/:id` | — | Album detail + community rating |
| GET | `/api/albums/:id/reviews` | — | All reviews for an album |
| POST | `/api/reviews` | ✓ | Submit a rating + review |
| PUT | `/api/reviews/:id` | ✓ | Edit own review |
| DELETE | `/api/reviews/:id` | ✓ | Delete own review |
