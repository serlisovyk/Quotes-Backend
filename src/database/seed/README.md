# 🌱 Seed Data

This folder contains database seed assets and maintenance scripts for the quotes database.

The seed flow is intentionally separate from the normal application startup because importing quote data can be slow and the main import script resets database tables.

## 📁 Files

```text
src/database/seed/
  data/
    test-quotes.csv
  scripts/
    import-quotes.seed.js
    remove-rare-categories.seed.js
  sampleSQLQueries.sql
```

## ⚙️ Requirements

Before running seed scripts, make sure the project root `.env` contains valid database settings:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=verify-full
DB_DIALECT=postgres

CSV_IMPORT_BATCH_SIZE=1000
CSV_IMPORT_BATCH_TIMEOUT=100
```

For local destructive imports, also set:

```env
ALLOW_SEED_RESET=true
```

Keep `ALLOW_SEED_RESET` unset or `false` for shared, staging, and production databases.

## 🗄️ Option 1: Import From A Database Dump

If you have a prepared PostgreSQL dump, importing it is usually faster than CSV seeding.

1. Start the development database and Adminer:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

1. Open Adminer at `http://localhost:8080`.
1. Connect to the local PostgreSQL service.
   - System: `PostgreSQL`
   - Server: value from `ADMINER_DEFAULT_SERVER`, usually `postgres`
   - Username: value from `POSTGRES_USER`
   - Password: value from `POSTGRES_PASSWORD`
   - Database: value from `POSTGRES_DB`
1. Use Adminer's import screen to load the dump file.
1. Verify the imported tables and row counts.

The dump file is not stored in this repository. If you need the full dataset, get it from the project owner.

## 📄 Option 2: Import From CSV

The CSV import script reads `src/database/seed/data/test-quotes.csv`, resets the Sequelize tables with `sequelize.sync({ force: true })`, imports quotes, creates categories, and connects quotes to categories.

Run from the project root:

```bash
node src/database/seed/scripts/import-quotes.seed.js
```

The script will refuse to run unless `ALLOW_SEED_RESET=true` is set in `.env`.

If the import is too heavy for the current environment, tune:

```env
CSV_IMPORT_BATCH_SIZE=1000
CSV_IMPORT_BATCH_TIMEOUT=100
```

A lower batch size and a higher timeout make the import gentler but slower.

## 🧹 Remove Rare Categories

After importing quote data, you can remove categories that are attached to one or two quotes. The cleanup also removes quotes that are left without categories.

Run from the project root:

```bash
node src/database/seed/scripts/remove-rare-categories.seed.js
```

This script is not guarded by `ALLOW_SEED_RESET`, but it still mutates data. Run it only against a database where this cleanup is expected.

## 📊 Expected Large Dataset Size

A full import can produce approximately:

- Categories: `~42,000` rows
- Quotes: `~418,000` rows
- QuoteCategories: `~2,100,000` rows

Exact numbers depend on the source CSV or dump.

## 📝 Notes

- Seed scripts use the same Sequelize models and associations as the application.
- Seed utilities live in `src/utils/seed`.
- SQL examples for manual inspection live in `sampleSQLQueries.sql`.
- Do not run destructive seed commands against a database you cannot safely recreate.
