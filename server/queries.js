// const options = {
  /* initialization options */
// };

// const pgp = require('pg-promise')(options);

// pgp.pg.defaults.ssl = true;
// const connectionString = process.env.DATABASE_URL;
// const db = pgp(connectionString);

function api(req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
}

function getmapdata(req, res) {
  db.one('SELECT $1 AS value', 123)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json({
          status: 'success',
          data,
          message: data.value,
        });
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
}

module.exports = {
  // db,
  api,
  getmapdata,
};
