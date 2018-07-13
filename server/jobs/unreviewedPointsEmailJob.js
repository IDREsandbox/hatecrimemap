const nodemailer = require('nodemailer');
const { CronJob } = require('cron');

const db = require('../models');

const countUnreviewedPoints = 'SELECT COUNT(verified) FROM hcmdata WHERE verified = -1';
const gmailAddress = process.env.GMAIL_ADDRESS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailAddress,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const onTick = () => {
  console.log('Running unreveiwed points email job...');
  db.one(countUnreviewedPoints)
    .then(({ count }) => {
      if (Number(count) < 1) {
        return;
      }
      const mailOptions = {
        from: gmailAddress,
        to: gmailAddress,
        subject: `${count} unreviewed incident reports!`,
        html: `You have ${count} reports that need to be reviewed. Click <a href="http://www.hatecrimemap.com/verifyincidents" target="_blank">here</a> to review them.`,
      };
      transporter.sendMail(mailOptions);
      console.log('Finished unreviewed points email job.');
    })
    .catch(err => console.log(err));
};

const unreviewedPointsEmailJob = new CronJob({
  cronTime: '0 8 * * 1',
  onTick,
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = unreviewedPointsEmailJob;
