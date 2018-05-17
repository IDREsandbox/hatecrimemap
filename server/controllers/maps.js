const express = require('express');

const db = require('../models');

const router = express.Router();
const pointsInUSQuery = 'SELECT lon, lat, reporttype, locationname, verified, featureid, sourceurl, groupharassedcleaned, validsourceurl FROM hcmdata WHERE (lon < -66.796875 AND lon > -124.5849609375) AND (lat < 49.00905080938215 AND lat > 25.125392611512158)';

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

router.post('/reportincident', (req, res) => {
  console.log(req.body);
  res.end('server received data');
});

module.exports = router;
