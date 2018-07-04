// const checkValidUrlsJob = require('./checkValidUrlsJob');
const unreviewedPointsEmailJob = require('./unreviewedPointsEmailJob');

const startJobs = () => {
  // checkValidUrlsJob.start();
  unreviewedPointsEmailJob.start();
};

module.exports = startJobs;
