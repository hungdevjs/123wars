import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT,
};

export default environments;
