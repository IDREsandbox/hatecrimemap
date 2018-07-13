const { CronJob } = require('cron');
const axios = require('axios');
const { isUri } = require('valid-url');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');

const updateValidSourceUrl = (urlState, id) => new Promise((resolve) => {
  db.none(new PQ('UPDATE hcmdata SET validsourceurl = $1 WHERE id = $2', [urlState, id]))
    .then(() => resolve())
    .catch(err => console.log(err));
});

const checkUrl = async (url, validsourceurl, id) => {
  await axios.get(url)
    .then(async () => {
      if (!validsourceurl) {
        await updateValidSourceUrl(true, id);
      }
    })
    .catch(async () => {
      if (validsourceurl) {
        await updateValidSourceUrl(false, id);
      }
    });
};

/* eslint-disable */

const validateUrls = async (data) => {
  for (const point of data) {
    const { id, sourceurl, validsourceurl } = point;
    if (isUri(sourceurl)) {
      await checkUrl(sourceurl, validsourceurl, id);
    }
  }
  console.log('Finished check for valid urls job.');
};

/* eslint-enable */

const onTick = () => {
  console.log('Running check for valid urls job...');
  db.any(`SELECT id, sourceurl, validsourceurl FROM hcmdata WHERE sourceurl != ''`) // eslint-disable-line
    .then(data => validateUrls(data))
    .catch(err => console.log(err));
};

const checkValidUrlsJob = new CronJob({
  cronTime: '0 23 * * 0', // Sunday at midnight
  onTick,
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = checkValidUrlsJob;
