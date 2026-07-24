# In order to populate Database you have two options

- (Better) Import all DB data from the dump file `db-without-rare-categories.sql.gz` directly to the database without importQuotes.js script
- Import data from the `quotes.csv` file and then remove rare categories (see detailed steps below)

NOTE: To get the files write to me on github / linkedin

## OPTION 1 - Load data from the dump file

1. `cd server`
1. `docker compose up -d`

## Connect to adminer and load data

1. Connect to the Adminer web interface `http://localhost:8080`
1. Enter credentials to connect to the PostgreSQL database container
   - System: PostgreSQL
   - Server: postgres
   - Username: admin
   - Password: admin_password
   - Database: db
1. Click Import on the left and choose path to the `db-without-rare-categories.sql.gz` file and click Execute
1. Verify results of the import

## OPTION 2 - Import quotes data from the CSV (Takes more time!)

1. `cd server`
1. `docker compose up -d`

## Import quotes from the CSV

1. Change directory to the `src/database/seed` folder
1. Run `importQuotes.js` to import quotes from the CSV file to the database and wait for about 2-3 hours

```javascript
  node importQuotes.js
```

NOTE: If import process crashes decrease `BATCH_SIZE` and increase `BATCH_TIMEOUT`

## Remove rare categories

1. Run `removeRareCategories.js` to delete categories which appear in one or two quotes.

```javascript
 node removeRareCategories.js
```

1. This script will also remove quotes which will be left without categories

## Final DB structure

- Categories (~ 42,438 rows)
- Quotes (~ 418,388 rows)
- QuoteCategories (~ 2,115,370 rows)
