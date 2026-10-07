# Content Service

Content catalog microservice for the Movu platform. Owns movies, series, genres, people/credits, and syncing catalog data from [TMDB](https://www.themoviedb.org/). Communicates exclusively over NATS — all client traffic reaches it through the [client-gateway](../client-gateway).

## Tech stack

- [NestJS](https://nestjs.com/) 11 (microservice mode)
- [NATS](https://nats.io/) transport (`@nestjs/microservices`)
- [TypeORM](https://typeorm.io/) + PostgreSQL (`pg`)
- `axios` for the TMDB HTTP integration
- `class-validator` / `class-transformer` for DTO validation
- `Joi` for environment variable validation
- `slugify` for generating URL-friendly slugs

## Architecture

The service registers as a NATS microservice (no HTTP listener). It ingests movie/series/genre/credit data from the TMDB API via a sync process, persists it, and serves it to the client-gateway. It also listens for rating updates published by the [review-service](../review-service) to keep aggregate rating stats current.

```
                              ┌── TMDB API (sync)
client-gateway --(NATS)--> content-service
                              ├── content-db (PostgreSQL)
                              └──(NATS event)── review-service
```

## Message patterns

| Pattern | Type | Description |
|---|---|---|
| `content.findAll` | Message | Paginated content listing |
| `content.search` | Message | Search content |
| `content.findTopRatedOfTheWeek` | Message | Top-rated content for the current week |
| `content.findOne` | Message | Get a single content item |
| `content.findByGenre` | Message | List content by genre |
| `content.ratingStatsChanged` | Event | Consumes rating updates published by review-service |
| `movies.findDetails` | Message | Full movie details (cast, credits, etc.) |
| `series.findDetails` | Message | Full series details |
| `genres.findAllByContentType` | Message | List genres for a content type (movie/series) |
| `persons.create` / `findAll` / `findOne` / `update` / `remove` | Message | Person/credit CRUD |
| `sync.all` | Message | Run a full TMDB sync |
| `sync.movieGenres` | Message | Sync movie genres from TMDB |
| `sync.seriesGenres` | Message | Sync series genres from TMDB |
| `sync.popularMovies` | Message | Sync popular movies from TMDB |
| `sync.popularSeries` | Message | Sync popular series from TMDB |
| `sync.clear` | Message | Clear synced content |

## Requirements

- Node.js 21+
- Docker & Docker Compose (recommended)
- A running PostgreSQL instance and NATS server (provided via Docker Compose)
- A [TMDB API read access token](https://www.themoviedb.org/settings/api) for sync operations

## Environment variables

Configuration is validated in `src/config/envs.ts`. When run via the root `docker-compose.yml`, these are supplied automatically from the repo-level `.env` file.

| Variable | Description |
|---|---|
| `PORT` | Port the service reports as running on (informational; NATS transport has no HTTP port) |
| `DB_HOST` | PostgreSQL host |
| `CONTENT_DB_PORT` | PostgreSQL port |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `CONTENT_DB_NAME` | PostgreSQL database name |
| `NATS_SERVERS` | Comma-separated list of NATS server URLs |
| `ENVIRONMENT` | Runtime environment name (e.g. `development`) |
| `TMDB_API_KEY` | TMDB v4 read access token, used for sync |
| `MOVIES_MAX_TOTAL_FETCH_PAGES` | Max number of TMDB pages to fetch per sync run |

## Running the service

### With Docker Compose (recommended)

From the repository root:

```bash
cp .env.template .env
# fill in the required values in .env, including TMDB_API_KEY
docker compose up content-service content-db nats-server
```

Or start the entire stack:

```bash
docker compose up
```

### Standalone (local development)

```bash
npm install
```

Create a `.env` file in this directory with the variables listed above, then:

```bash
npm run start:dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the service |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start in watch mode with the debugger attached |
| `npm run start:prod` | Run the compiled build (`dist/main`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Lint and auto-fix source files |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage report |

## Project structure

```
src/
├── apis/
│   └── tmdb/            # TMDB HTTP client, mappers, response interfaces
├── content/              # Unified content queries (movies + series)
├── movie/                  # Movie entity, CRUD, details
├── series/                   # Series entity, CRUD, details
├── genres/                     # Genre entity and lookups
├── person/                       # Person/credit entity and CRUD
├── sync/
│   └── tmdb-sync/                  # TMDB sync orchestration
├── infrastructure/
│   └── messaging/
│       └── review-client/            # NATS client module for calling review-service
├── common/                              # Shared DTOs, enums, adapters, interfaces
├── config/                                # Environment variable validation
├── app.module.ts
└── main.ts
```
