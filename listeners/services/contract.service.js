import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';

import DollarAuction from '../assets/abis/DollarAuction.json' assert { type: 'json' };
import environments from '../utils/environments.js';
import quickNode from '../configs/quicknode.config.js';

const { WORKER_PRIVATE_KEY, DOLLAR_AUCTION_ADDRESS } = environments;

export const getWorkerWallet = () => {
  const wallet = new Wallet(WORKER_PRIVATE_KEY, quickNode);
  return wallet;
};

export const getGameContract = (signer) => {
  const contract = new Contract(DOLLAR_AUCTION_ADDRESS, DollarAuction.abi, signer);
  return contract;
};

export const decodeGameTxnLogs = (name, log) => {
  const { data, topics } = log;
  const adminwallet = getAdminWallet();
  const gameContract = getGameContract(adminwallet);
  return gameContract.interface.decodeEventLog(name, data, topics);
};
