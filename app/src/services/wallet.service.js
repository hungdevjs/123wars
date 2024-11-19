import api from './api';

export const getWalletMessage = ({ address }) => api.get('/api/v1/wallets/message', { params: { address } });
