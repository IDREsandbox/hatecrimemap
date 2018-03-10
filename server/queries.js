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

function api(req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
}

function getmapdata(req, res) {
  db.any('SELECT x, y FROM hcmdata')
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
          message: 'Successfully queried db for all coordinates!',
        });
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
}

module.exports = {
  api,
  getmapdata,
};
