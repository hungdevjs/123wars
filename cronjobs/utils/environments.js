import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
  NETWORK_ID: process.env.NETWORK_ID,
  QUICKNODE_HTTPS_ENDPOINT: process.env.QUICKNODE_HTTPS_ENDPOINT,
  WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY,
  GAME_ADDRESS: process.env.GAME_ADDRESS,
  CRON_SEND_REWARDS: process.env.CRON_SEND_REWARDS,
};

export default environments;
