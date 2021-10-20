const pgp = require('pg-promise')(/* options */); 
//pg-promise = js module to connect to a pg (postgreSQL) database

const connectionString = process.env.DB_STRING;
const db = pgp(connectionString);

module.exports = db;
