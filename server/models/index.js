require('dotenv').config();
const pgp = require('pg-promise')(/* options */);

const connectionString = `${process.env.DATABASE_URL}?ssl=true`;
const db = pgp(connectionString);

module.exports = db;
