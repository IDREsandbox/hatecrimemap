const checkValidUrlsJob = require('./checkValidUrlsJob');
const unreviewedPointsEmailJob = require('./unreviewedPointsEmailJob');
const waybackMachineJob = require('./waybackMachineJob');

const startJobs = () => {
  checkValidUrlsJob.start();
  unreviewedPointsEmailJob.start();
  waybackMachineJob.start();
};

module.exports = startJobs;
