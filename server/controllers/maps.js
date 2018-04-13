const express = require('express');

const db = require('../models');

const router = express.Router();
const allQuery = 'SELECT lon, lat, reporttype, locationname, verified, featureid, sourceurl, groupharassedcleaned FROM hcmdata';

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/allpoints', (req, res) => {
  db.any(allQuery)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch((err) => {
      console.log('ERROR:', err);
    });
});

module.exports = router;
