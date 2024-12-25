import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';

import War from '../assets/abis/War.json' assert { type: 'json' };
import environments from '../utils/environments.js';
import quickNode from '../configs/quicknode.config.js';

const { ADMIN_PRIVATE_KEY, WORKER_PRIVATE_KEY, SIGNER_PRIVATE_KEY, GAME_ADDRESS } = environments;

export const getAdminWallet = () => {
  const wallet = new Wallet(ADMIN_PRIVATE_KEY, quickNode);
  return wallet;
};

export const getWorkerWallet = () => {
  const wallet = new Wallet(WORKER_PRIVATE_KEY, quickNode);
  return wallet;
};

export const getSignerWallet = () => {
  const wallet = new Wallet(SIGNER_PRIVATE_KEY, quickNode);
  return wallet;
};

export const getGameContract = (signer) => {
  const contract = new Contract(GAME_ADDRESS, War.abi, signer);
  return contract;
};

export const decodeGameTxnLogs = (name, log) => {
  const { data, topics } = log;
  const adminwallet = getAdminWallet();
  const gameContract = getGameContract(adminwallet);
  return gameContract.interface.decodeEventLog(name, data, topics);
};
