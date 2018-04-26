const express = require('express');

const db = require('../models');

const router = express.Router();
const allpointsQuery = 'SELECT lon, lat, reporttype, locationname, verified, featureid, sourceurl, groupharassedcleaned, validsourceurl FROM hcmdata';

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/allpoints', (req, res) => {
  db.any(allpointsQuery)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.post('/submitclaim', (req, res) => {
  console.log(req.body);
  res.end('server received data');
});

module.exports = router;
