const environments = require('./environments');
const secrets = require('../secrets.json');

const { ENVIRONMENT } = environments;

const configs =
  ENVIRONMENT === 'production' ? secrets.base : secrets.baseSepolia;

module.exports = configs;
