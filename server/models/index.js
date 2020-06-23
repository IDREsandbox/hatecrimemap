const pgp = require('pg-promise')(/* options */);

const connectionString = process.env.DB_STRING;
const db = pgp(connectionString);

module.exports = db;
