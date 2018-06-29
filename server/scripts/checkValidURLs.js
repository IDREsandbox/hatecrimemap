// const { CronJob } = require('cron');
const request = require('request');
const { isUri } = require('valid-url');

const db = require('../models');

function updateValidSourceUrl(urlState, id) {
  db.none(`UPDATE hcmdata SET validsourceurl = ${urlState} WHERE id = ${id}`)
    .catch(err => console.log('ERROR:', err));
}

function validateUrls(urls) {
  urls.forEach(({ id, sourceurl, validsourceurl }) => {
    if (!isUri(sourceurl)) {
      if (validsourceurl) updateValidSourceUrl(false, id);
      return;
    }
    request
      .get(sourceurl)
      .on('response', (res) => {
        if (res.statusCode < 400 && !validsourceurl) updateValidSourceUrl(true, id);
        else if (res.statusCode >= 400 && validsourceurl) updateValidSourceUrl(false, id);
      })
      .on('error', (err) => {
        if (validsourceurl) updateValidSourceUrl(false, id);
        return console.log('ERROR:', err);
      });
  });
}

function getAllUrls(id) {
  db.any(`SELECT ${id}, sourceurl, validsourceurl FROM hcmdata`)
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
