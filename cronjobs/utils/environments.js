import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
  NETWORK_ID: process.env.NETWORK_ID,
  QUICKNODE_HTTPS_ENDPOINT: process.env.QUICKNODE_HTTPS_ENDPOINT,
  GAME_ADDRESS: process.env.GAME_ADDRESS,
};

export default environments;
