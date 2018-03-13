const express = require('express');

const db = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/allpoints', (req, res) => {
  db.any('SELECT lon, lat FROM hcmdata')
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'Successfully queried db for all coordinates!',
        });
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
});

module.exports = router;
