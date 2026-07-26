# Architecture Rules

## Layer Responsibilities

- `src/app.js` configures Express middleware and mounts routers.
- `src/main.js` is the application bootstrap entry point.
- `src/server.js` starts the HTTP server and registers graceful shutdown.
- `controllers/` handle HTTP input and output only.
- `routes/` define HTTP routes, validators, validation middleware, and async wrapping.
- `services/` contain application logic and Sequelize model usage.
- `database/` contains the Sequelize instance, models, associations, and seed scripts.
- `validators/` contain Express Validator chains.
- `middlewares/` contain reusable Express middleware.
- `errors/` contain application error classes and error factories.
- `utils/` contain reusable helpers grouped by domain.
- `constants/` contain shared constants that are reused in multiple places.

## Boundaries

- Do not call services from routers directly; route through controllers.
- Do not put business decisions inside routers.
- Do not parse or validate request input inside services.
- Do not create a repository layer unless the user explicitly asks for it.
- Keep route mounting explicit in `src/app.js`.
- Keep database startup logic outside `src/app.js`.
- Keep graceful shutdown logic outside controllers and services.

## Data Access

- Services may use Sequelize models directly in this project.
- Keep complex Sequelize query option construction in `src/utils/query-builders`.
- Keep many-to-many association setup in `src/database/models/associations.js`.
- Keep model hooks in `src/database/models/hooks`.
- Return empty arrays for empty collection/list responses unless the API contract explicitly requires an error.
- Avoid raw SQL unless Sequelize cannot express the operation clearly.

## Configuration

- Read environment variables through `src/config/app.config.js`.
- Do not add config validation in this project unless the user explicitly asks for it.
- Keep config export names uppercase, for example `APP_PORT` and `DATABASE_URL`.
