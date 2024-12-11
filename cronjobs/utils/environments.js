import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
  NETWORK_ID: process.env.NETWORK_ID,
  QUICKNODE_HTTPS_ENDPOINT: process.env.QUICKNODE_HTTPS_ENDPOINT,
  WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY,
  DOLLAR_AUCTION_ADDRESS: process.env.DOLLAR_AUCTION_ADDRESS,
  CRON_CRAW_ROUND_DATA: process.env.CRON_CRAW_ROUND_DATA,
  CRON_CHECK_ROUND_END: process.env.CRON_CHECK_ROUND_END,
};

export default environments;
