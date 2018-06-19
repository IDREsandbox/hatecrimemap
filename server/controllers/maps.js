const express = require('express');

const db = require('../models');

const router = express.Router();
const desiredColumns = 'lon, lat, reporttype, locationname, verified, id, sourceurl, groupsharassed, validsourceurl';
const pointsInUSQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE (lon < -66.796875 AND lon > -124.5849609375) AND (lat < 49.00905080938215 AND lat > 25.125392611512158)`;
const unreviewedPointsQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE verified = -1`;

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
  locationname: string,
  verified: numeric,
  reporttype: string,
  sourceurl: string,
  datesubmitted: UTC string,
  groupsharassed: string,
  validsourceurl: bool,
  lon: numeric,
  lat: numeric,
  reviewedbystudent: bool,
  date: UTC string,
}

*/

// function testInsert() {
//   db.one(`INSERT INTO hcmdata (date, datesubmitted, groupsharassed, lat, locationname, lon, sourceurl, validsourceurl, verified, reviewedbystudent) VALUES(('Tue, 12 Jun 2018 19:36:46 GMT')::date, ('Tue, 12 Jun 2018 19:36:46 GMT')::date, 'Arab,African American,Asian American', 34.0194543, 'SLO', -118.4911912, '', false, -1, true)`)
//     .then(data => console.log(data));
// }

router.post('/reportincident', (req, res) => {
  console.log(req.body);
  res.end('server received data');
});

router.delete('/removeincident', (req, res) => {
  console.log(req.body);
  res.send('incident removed');
});

module.exports = router;
