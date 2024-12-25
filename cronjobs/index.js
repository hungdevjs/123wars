import cron from 'node-cron';

import sendRewards from './tasks/sendRewards.js';
import environments from './utils/environments.js';

const { CRON_SEND_REWARDS } = environments;

const main = () => {
  if (CRON_SEND_REWARDS) {
    console.log('1. init job sendRewards');
    sendRewards();
    cron.schedule(CRON_SEND_REWARDS, sendRewards);
  }
};

main();
