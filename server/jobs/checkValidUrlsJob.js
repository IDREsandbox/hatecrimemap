const { CronJob } = require('cron');
const request = require('request');
const { isUri } = require('valid-url');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');

const updateValidSourceUrl = (urlState, id) => {
  db.none(new PQ('UPDATE hcmdata SET validsourceurl = $1 WHERE id = $2', [urlState, id]))
    .catch(err => console.log('ERROR:', err));
};

const validateUrls = (urls) => {
  let invalidUrls = 0;
  urls.forEach(({ id, sourceurl, validsourceurl }) => {
    if (!isUri(sourceurl)) {
      if (validsourceurl) {
        updateValidSourceUrl(false, id);
        invalidUrls++;
      }
      return;
    }
    request
      .get(sourceurl)
      .on('response', (res) => {
        if (res.statusCode < 400 && !validsourceurl) {
          updateValidSourceUrl(true, id);
        } else if (res.statusCode >= 400 && validsourceurl) {
          updateValidSourceUrl(false, id);
          invalidUrls++;
        }
      })
      .on('error', () => {
        if (validsourceurl) {
          updateValidSourceUrl(false, id);
          invalidUrls++;
        }
      });
  });
  console.log(`${invalidUrls} urls flagged as invalid.`);
};

const onTick = () => {
  console.log('Running check for valid urls job...');
  db.any(`SELECT id, sourceurl, validsourceurl FROM hcmdata WHERE sourceurl != ''`) // eslint-disable-line
    .then(urls => validateUrls(urls))
    .catch(err => console.log(err));
};

const checkValidUrlsJob = new CronJob({
  cronTime: '0 0 0 * * 0',
  onTick,
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = checkValidUrlsJob;
