# Architecture Rules

All sources live in `src/`; `src/main.js` starts them with Node, there is no build step. `ai/map.md`
says where every folder lives; `ai/rules/api.md` covers validation, errors and responses.

## Layers

A request flows one way: router → validators → controller → service → model. Each folder has one
job:

| Layer          | Owns                                                                    | Must not                                            |
| -------------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| `main.js`      | startup order: database sync, ID sequence reset, server start           | hold routes or logic                                |
| `app.js`       | middleware setup and explicit route mounting                            | start the server or the database                    |
| `server.js`    | the HTTP listener and graceful shutdown registration                    | hold routes or logic                                |
| `routes/`      | paths, validators, `validationErrorHandler`, `asyncHandler(controller)` | decide anything; call a service                     |
| `validators/`  | Express Validator chains                                                | read the database                                   |
| `controllers/` | HTTP input and output: read `req`, call a service, answer               | use Sequelize; parse or validate input              |
| `services/`    | application logic and Sequelize model calls                             | read `req` or `res`; validate request input         |
| `database/`    | the Sequelize instance, models, associations, hooks, seed scripts       | know about HTTP                                     |
| `middlewares/` | reusable Express middleware                                             | hold resource logic                                 |
| `errors/`      | error classes and the error factory                                     | know about a resource                               |
| `utils/`       | reusable helpers grouped by domain                                      | know about a request                                |
| `constants/`   | shared values used in more than one place                               | hold logic or import a model, service or controller |
| `config/`      | the only reader of environment variables                                | be bypassed by a direct `process.env` read          |

## Data access

- Services use Sequelize models directly; there is no repository layer (decision
  `rejected-features`).
- A complex query option set (`where`, `include`, `order`, `attributes`) is built in
  `utils/query-builders/`; options shared by queries live in `constants/query-options.constant.js`.
- Many-to-many associations are set in `database/models/associations.js`; model hooks live in
  `database/models/hooks/`. `database/models/index.js` loads the associations and exports the models,
  so a service imports them from `#models`.
- A collection or list answers an empty array when nothing matches, not an error, unless the API
  contract says otherwise.
- Raw SQL only when Sequelize cannot express the operation clearly.
- Writes that belong together run in one `sequelize.transaction`.

## Configuration

- Environment variables are read through `config/app.config.js`, nowhere else; export names are
  uppercase (`APP_PORT`, `DATABASE_URL`). Config is not validated (decision `rejected-features`).
- `.env.sample` lists every key; `.env*` stays out of git.

## Proxy

- `app.set('trust proxy', TRUST_PROXY_HOPS)` stays before `express-rate-limit`, so the limiter counts
  client IPs and not the proxy's (decision `trust-proxy-hop-count`).
- `TRUST_PROXY_HOPS` is a number, never `true`; it changes only when the proxy topology changes.

## Boundaries

- Route mounting stays explicit in `app.js`; database startup and graceful shutdown stay outside
  `app.js`, controllers and services.
- A router never calls a service and holds no business decision.
- No `try/catch` in a controller unless it has a genuinely local recovery path; errors travel to the
  error middleware (`ai/rules/api.md`).
- The seed scripts are the only code that may reset tables, and only behind `ALLOW_SEED_RESET`.
- No new layer, abstraction or pattern from `ai/rules/scope.md` without an explicit request.
