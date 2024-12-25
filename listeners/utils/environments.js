import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
  NETWORK_ID: process.env.NETWORK_ID,
  QUICKNODE_WSS_ENDPOINT: process.env.QUICKNODE_WSS_ENDPOINT,
  WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY,
};

export default environments;
