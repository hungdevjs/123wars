import axios from 'axios';

import environments from '../utils/environments';
import { getToken } from '../utils/storage';

const { BACKEND_URL } = environments;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log({ error });
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log({ err });
    const error = (err.response && err.response.data) || err.message;
    const message = error.startsWith('API error')
      ? error.replace('API error: ', '')
      : error;
    throw new Error(message);
  }
);

export default api;
