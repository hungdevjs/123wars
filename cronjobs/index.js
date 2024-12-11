import cron from 'node-cron';

import crawRoundData from './tasks/crawRoundData.js';
import checkRoundEnd from './tasks/checkRoundEnd.js';
import environments from './utils/environments.js';

const { CRON_CRAW_ROUND_DATA, CRON_CHECK_ROUND_END } = environments;

const main = () => {
  if (CRON_CRAW_ROUND_DATA) {
    console.log('1. init job crawRoundData');
    crawRoundData();
    cron.schedule(CRON_CRAW_ROUND_DATA, crawRoundData);
  }

  if (CRON_CHECK_ROUND_END) {
    console.log('2. init job checkRoundEnd');
    checkRoundEnd();
    cron.schedule(CRON_CHECK_ROUND_END, checkRoundEnd);
  }
};

main();
