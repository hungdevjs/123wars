import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  THIRD_WEB_CLIENT_ID: process.env.THIRD_WEB_CLIENT_ID,
  THIRD_WEB_SECRET_KEY: process.env.THIRD_WEB_SECRET_KEY,
  CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
};

export default environments;
