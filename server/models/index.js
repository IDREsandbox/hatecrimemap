require('dotenv').config();
const pgp = require('pg-promise')(/* options */);

let connectionString;
if (process.env.NODE_ENV !== 'development') {
  connectionString = process.env.DATABASE_URL;
  pgp.pg.defaults.ssl = true;
} else {
  connectionString = process.env.LOCALDB_URL;
}
const db = pgp(connectionString);

module.exports = db;
