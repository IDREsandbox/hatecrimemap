const express = require('express');

const db = require('../models');

const router = express.Router();
const desiredColumns = 'lon, lat, reporttype, locationname, verified, featureid, sourceurl, groupsharassed, validsourceurl';
const pointsInUSQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE (lon < -66.796875 AND lon > -124.5849609375) AND (lat < 49.00905080938215 AND lat > 25.125392611512158)`;
const unreviewedPointsQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE verified = 0`;
// const insertUnconfirmedPoint = `
//   INSERT INTO hcmdata
//   (locationname, verified)
//   VALUES('SLO', '-1')
// `;

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/usapoints', (req, res) => {
  db.any(pointsInUSQuery)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.get('/unreviewedpoints', (req, res) => {
  db.any(unreviewedPointsQuery)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.post('/verifyincident', (req, res) => {
  console.log(req.body);
  res.end('incident verified');
});

/*

{
  locationname: 'SLO',
  verified: -1,
  date: // UTC date
  datesubmitted: // UTC date
  groupsharassed: '',
  lat: numeric,
  lon: numeric,
  sourceurl: '',
  validsourceurl: bool,
}

*/

router.post('/reportincident', (req, res) => {
  console.log(req.body);
  res.end('server received data');
});

router.delete('/removeincident', (req, res) => {
  console.log(req.body);
  res.send('incident removed');
});

module.exports = router;
