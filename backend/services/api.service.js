import axios from 'axios';

import environments from '../utils/environments.js';

const { THIRD_WEB_SECRET_KEY } = environments;

const api = axios.create({
  baseURL: 'https://in-app-wallet.thirdweb.com/api/2023-11-30',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    config.headers['x-secret-key'] = THIRD_WEB_SECRET_KEY;
    return config;
  },
  (error) => {
    console.log({ error });
    Promise.reject(error);
  }
);

export const getUserDetail = (walletAddress) =>
  api.get('/embedded-wallet/user-details', {
    params: {
      queryBy: 'walletAddress',
      walletAddress,
    },
  });
