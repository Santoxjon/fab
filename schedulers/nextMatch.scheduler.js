// scheduler.js
const schedule = require('node-schedule');
const { getDom } = require('../helpers/puppeteer.helper');
const { convertDateToHHMMSS } = require('../helpers/dates.helper');
require('dotenv').config();

const updateNextMatchCache = () => {
  return schedule.scheduleJob('*/60 * * * * *', async () => {
    await getDom(process.env.NEXT_MATCH_URL);
  });
};

const dailyUpdate = () => {
  return schedule.scheduleJob('0 5 * * *', async () => {
    console.log('Running daily update at 5 AM...', convertDateToHHMMSS(new Date()));
    await getDom(process.env.NEXT_MATCH_URL);
  });
};

module.exports = { updateNextMatchCache, dailyUpdate };
