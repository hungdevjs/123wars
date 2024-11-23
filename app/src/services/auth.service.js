import api from './api';

export const getLoginPayload = ({ address, chainId }) =>
  api.get('/api/v1/auth/login', { params: { address, chainId } });

export const validateLoginPayload = (data) =>
  api.post('/api/v1/auth/login', data);

export const getMe = () => api.get('/api/v1/auth/me');
