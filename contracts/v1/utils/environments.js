const dotenv = require('dotenv');
dotenv.config();

const environments = {
  ENVIRONMENT: process.env.ENVIRONMENT,
};

module.exports = environments;
