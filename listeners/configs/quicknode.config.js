import { WebSocketProvider } from '@ethersproject/providers';

import environments from '../utils/environments.js';

const { QUICKNODE_WSS_ENDPOINT, NETWORK_ID } = environments;

const provider = new WebSocketProvider(QUICKNODE_WSS_ENDPOINT, Number(NETWORK_ID));

export default provider;

export const getProvider = () => {
  return new WebSocketProvider(QUICKNODE_WSS_ENDPOINT, Number(NETWORK_ID));
};
