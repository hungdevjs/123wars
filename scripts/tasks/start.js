import { getGameContract, getWorkerWallet } from '../services/contract.service.js';
import { updateRound } from '../services/round.service.js';
import { delay } from '../utils/functions.js';

const start = async () => {
  const workerWallet = getWorkerWallet();
  const gameContract = getGameContract(workerWallet);

  const currentRoundId = await gameContract.roundId();
  if (Number(currentRoundId.toString()) !== 0) throw new Error('Game started');

  await gameContract.start();
  console.log('started - waiting for node to get data...');

  await delay(10000);

  await updateRound();
};

start()
  .then(() => console.log('ok'))
  .catch((err) => console.error(err));
