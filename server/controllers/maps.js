const express = require('express');

const { db } = require('../queries');

const router = express.Router();

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home page');
});

router.get('/allpoints', (req, res) => {
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
});

module.exports = router;
