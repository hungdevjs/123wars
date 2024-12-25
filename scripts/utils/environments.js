import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
  NETWORK_ID: process.env.NETWORK_ID,
  QUICKNODE_HTTPS_ENDPOINT: process.env.QUICKNODE_HTTPS_ENDPOINT,
  WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY,
};

export default environments;
