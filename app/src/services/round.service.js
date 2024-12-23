import api from './api';

export const generateBetSignature = ({ value, option }) => api.post('/api/v1/rounds/signature', { value, option });
