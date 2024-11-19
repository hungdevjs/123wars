import api from './api';

export const init = ({ message, signature }) => api.post('/api/v1/users/me', { message, signature });

export const updateUsername = ({ username }) => api.patch('/api/v1/users/me/username', { username });
