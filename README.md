# Quotes Server

💬 REST API server for a quotes application.

This backend provides quote and category data through a compact Express + Sequelize API. The project is intentionally small, but organized around real backend layers: application bootstrap, routing, controllers, services, validation, database utilities, centralized errors, request logging, and tests.

## ✨ Features

- Quote listing with pagination, author search, text search, and category filtering
- Random quotes endpoint with request validation
- Single quote lookup by numeric ID
- Quote creation, update, and deletion
- Category listing with pagination and search
- PostgreSQL database access through Sequelize
- Many-to-many quote/category relations
- CSV seed utilities for importing quote data
- Centralized application errors and consistent error responses
- Express Validator request validation
- Basic request logging middleware
- Helmet, CORS, rate limiting, and JSON body limits
- Graceful HTTP/database shutdown
- Docker Compose setup for production-like and development environments
- Vitest test suite for controllers, routes, services, middlewares, errors, and utilities

## 🧰 Tech Stack

- Node.js
- Express
- JavaScript ESM
- PostgreSQL
- Sequelize
- Express Validator
- Helmet
- CORS
- Express Rate Limit
- Docker
- Vitest
- Supertest
- ESLint
- Prettier
- Husky and lint-staged
- GitHub Actions
- Npm

## 📁 Project Structure

```text
src/
  app.js          Express app setup, global middleware, and route mounting
  main.js         Application bootstrap entry point
  server.js       HTTP server startup and graceful shutdown registration
  config/         Environment variable access
  constants/      Shared app, query, validation, and error constants
  controllers/    HTTP request handlers grouped by resource
  database/       Sequelize instance, models, associations, and seed scripts
  errors/         Application error classes and factories
  logger/         Logger service wrapper
  middlewares/    Express middleware modules
  routes/         Express routers grouped by resource
  services/       Application logic and Sequelize model usage
  tests/          Shared test helpers and mocks
  utils/          Reusable HTTP, database, seed, server, and query helpers
  validators/     Express Validator chains grouped by resource
```

## ⚙️ Environment Variables

Create a `.env` file in the project root. Use `.env.sample` as the list of required keys.

```env
APP_PORT=3001

DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=verify-full
DB_DIALECT=postgres

CSV_IMPORT_BATCH_SIZE=1000
CSV_IMPORT_BATCH_TIMEOUT=100

ALLOW_SEED_RESET=false

POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=quotes

ADMINER_DEFAULT_SERVER=postgres
```

`ALLOW_SEED_RESET=true` is required only for the destructive CSV import seed script because it resets database tables before importing data. Keep it unset or `false` outside local seed/reset workflows.

## 🐳 Docker

Run the production-like compose file:

```bash
docker compose up -d
```

Run the development compose file with live source mounting and Adminer:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Adminer is available on port `8080` in the dev compose setup. Use `ADMINER_DEFAULT_SERVER=postgres` when connecting to the local compose database.

## 🚀 Scripts

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Run the server:

```bash
npm start
```

Lint code:

```bash
npm run lint
```

Fix what ESLint can fix:

```bash
npm run lint:fix
```

Format code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🔄 CI

GitHub Actions runs lint, the format check and the tests on every push. The pre-commit hook (Husky and lint-staged) runs ESLint and Prettier on the staged files. The workflow is in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## 🔌 API Endpoints

### Health

```http
GET /health
```

Returns the API health state.

### Quotes

```http
GET /quotes
```

Supported query parameters:

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| limit     | number | Page size, from `1` to `50`             |
| offset    | number | Number of rows to skip, starts from `0` |
| author    | string | Case-insensitive author search          |
| text      | string | Case-insensitive quote text search      |
| category  | string | Filter quotes by category slug/name     |

Example:

```http
GET /quotes?limit=10&offset=0&author=austen&category=wisdom
```

```http
GET /quotes/random?limit=5
```

Returns random quotes. `limit` is optional and capped by the app constants.

```http
GET /quotes/:id
POST /quotes
PATCH /quotes/:id
DELETE /quotes/:id
```

Create/update body example:

```json
{
  "text": "A quote with at least ten characters",
  "author": "Author Name",
  "categories": ["wisdom", "life"]
}
```

### Categories

```http
GET /categories
```

Supported query parameters:

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| limit     | number | Page size, from `1` to `50`             |
| offset    | number | Number of rows to skip, starts from `0` |
| name      | string | Case-insensitive category search        |

```http
GET /categories/:id
```

Returns a single category by numeric ID.

## ❌ Error Format

The API returns errors in a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "fields": {
      "limit": "Limit must be in range 1..50"
    }
  }
}
```

Validation errors that are related to the whole request instead of a specific field are placed under the `_root` key.

## 🌱 Seed Data

Seed scripts live in `src/database/seed/scripts` and use helpers from `src/utils/seed`.

The detailed seed guide is in `src/database/seed/README.md`. It covers CSV import, optional dump import through Adminer, rare category cleanup, required env values, and the `ALLOW_SEED_RESET=true` guard.

The CSV import script is destructive because it runs `sequelize.sync({ force: true })` before importing data. Keep `ALLOW_SEED_RESET` unset or `false` unless you are intentionally resetting a local seed database.

## 🧱 Architecture Notes

Layer responsibilities, boundaries, naming and testing rules live in [`ai/`](ai/): start with the [repo map](ai/map.md) and the [rules](ai/rules). Agents and contributors start from [`AGENTS.md`](AGENTS.md).
