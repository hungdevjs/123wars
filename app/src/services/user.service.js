import api from './api';

export const getMe = () => api.get('/api/v1/users/me');

export const validatePhoneNumber = () => api.put('/api/v1/users/me/phone');

export const checkReward = () => api.put('/api/v1/users/me/reward');
