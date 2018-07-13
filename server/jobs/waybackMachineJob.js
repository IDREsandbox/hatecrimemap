const { CronJob } = require('cron');
const axios = require('axios');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');

const waybackUrl = 'http://web.archive.org/save/';
const createWaybackPostApi = url => `${waybackUrl}${url}`;

const createAdjustedUrl = (url) => {
  const httpIndex = url.indexOf('://');
  if (httpIndex === -1) {
    return url;
  }
  const adjustedUrl = url.slice(httpIndex + 3);
  return adjustedUrl;
};

const getRedirUrl = (res, sourceurl) => {
  const { data } = res;
  const adjustedUrl = createAdjustedUrl(sourceurl);
  let redirUrl;
  data.split(' ').forEach((item) => {
    if (item.includes(adjustedUrl) && item.includes('/web/')) {
      redirUrl = item;
    }
  });
  if (redirUrl) {
    return redirUrl.slice(1, redirUrl.length - 3);
  }
  return redirUrl;
};

const updateAttemptedWaybackUrl = id => new Promise((resolve) => {
  db.none(new PQ('UPDATE hcmdata SET attemptedwaybackurl = true WHERE id = $1', [id]))
    .then(() => resolve())
    .catch(err => console.log(err));
});

const updateWaybackUrl = (id, redirUrl) => new Promise((resolve) => {
  const waybackurl = `https://web.archive.org${redirUrl}`;
    db.none(new PQ('UPDATE hcmdata SET waybackurl = $1, validwaybackurl = $2 WHERE id = $3', [waybackurl, true, id]))
      .then(() => resolve())
      .catch(err => console.log(err));
});

/* eslint-disable */

const sendToWaybackMachine = async (data) => {
  for (point of data) {
    const { id, sourceurl } = point;
    try {
      const waybackPostApi = createWaybackPostApi(sourceurl);
      const res = await axios.post(waybackPostApi);
      const redirUrl = getRedirUrl(res, sourceurl);
      if (redirUrl) {
        await updateWaybackUrl(id, redirUrl);
      }
      await updateAttemptedWaybackUrl(id);
    } catch (err) {
      await updateAttemptedWaybackUrl(id);
      console.log(err);
    }
  }
  console.log('Finished wayback machine job.')
};

/* eslint-enable */

const onTick = async () => {
  console.log('Running wayback machine job...');
  try {
    const data = await db.any('SELECT id, sourceurl FROM hcmdata WHERE validsourceurl = true AND attemptedwaybackurl = false');
    await sendToWaybackMachine(data);
  } catch (err) {
    console.log(err);
  }
};

const waybackMachineJob = new CronJob({
  cronTime: '0 2 * * 1', // Monday at 2am
  onTick,
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = waybackMachineJob;
