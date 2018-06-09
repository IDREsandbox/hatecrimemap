// const { CronJob } = require('cron');
const request = require('request');
const { isUri } = require('valid-url');

const db = require('../models');

function updateValidSourceUrl(urlState, featureid) {
  db.none(`UPDATE hcmdata SET validsourceurl = ${urlState} WHERE featureid = ${featureid}::varchar`)
    .catch(err => console.log('ERROR:', err));
}

function validateUrls(urls) {
  urls.forEach(({ featureid, sourceurl, validsourceurl }) => {
    if (!isUri(sourceurl)) {
      if (validsourceurl) updateValidSourceUrl(false, featureid);
      return;
    }
    request
      .get(sourceurl)
      .on('response', (res) => {
        if (res.statusCode < 400 && !validsourceurl) updateValidSourceUrl(true, featureid);
        else if (res.statusCode >= 400 && validsourceurl) updateValidSourceUrl(false, featureid);
      })
      .on('error', (err) => {
        if (validsourceurl) updateValidSourceUrl(false, featureid);
        return console.log('ERROR:', err);
      });
  });
}

function getAllUrls(featureid) {
  db.any(`SELECT ${featureid}, sourceurl, validsourceurl FROM hcmdata`)
    .then(urls => validateUrls(urls))
    .catch(err => console.log('ERROR:', err));
}

// const validateUrlsJob = new CronJob({
//   cronTime: '*/3 * * * * *',
//   onTick: () => console.log('job1 ticked'),
//   start: false,
//   timeZone: 'America/Los_Angeles',
// });

module.exports = getAllUrls;
