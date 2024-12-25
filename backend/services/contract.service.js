import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';

import { firestore } from '../configs/firebase.config.js';
import War from '../assets/abis/War.json' assert { type: 'json' };
import environments from '../utils/environments.js';
import quickNode from '../configs/quicknode.config.js';

const { ADMIN_PRIVATE_KEY, WORKER_PRIVATE_KEY, SIGNER_PRIVATE_KEY } = environments;

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

export const getGameContract = async (signer) => {
  const system = await firestore.collection('system').doc('main').get();
  const { addresses } = system.data();

  const contract = new Contract(addresses.game, War.abi, signer);
  return contract;
};

export const decodeGameTxnLogs = async (name, log) => {
  const { data, topics } = log;
  const adminwallet = getAdminWallet();
  const gameContract = await getGameContract(adminwallet);
  return gameContract.interface.decodeEventLog(name, data, topics);
};
