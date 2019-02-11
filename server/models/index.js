require('dotenv').config();
const pgp = require('pg-promise')(/* options */);

// const connectionString = `${process.env.DATABASE_URL}?ssl=true`;
const connectionString = 'postgres://wijhpidbhbgnez:58a7cbbf8ea368029c7c9f63aea3caddb900eb6a357e572830cb7ab456c06c2a@ec2-54-235-156-60.compute-1.amazonaws.com:5432/de1of4ov5iao3o?ssl=true';
const db = pgp(connectionString);

module.exports = db;
