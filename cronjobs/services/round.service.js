import { formatEther } from '@ethersproject/units';
import { AddressZero } from '@ethersproject/constants';

import admin, { firestore } from '../configs/firebase.config.js';
import { retry, delay } from '../utils/functions.js';
import { date } from '../utils/strings.js';
import { getGameContract, getWorkerWallet } from './contract.service.js';
import environments from '../utils/environments.js';

const { NETWORK_ID } = environments;

export const getActiveRoundId = async () => {
  const system = await firestore.collection('system').doc('main').get();
  const { activeRoundId } = system.data();

  return activeRoundId;
};

export const getActiveRound = async () => {
  const activeRoundId = await getActiveRoundId();

  const round = await firestore.collection('rounds').doc(activeRoundId).get();

  return { id: activeRoundId, ...round.data() };
};

const getUser = async (address) => {
  const user = await firestore.collection('users').where('address', '==', address).get();
  if (user.empty) return null;

  return { id: user.docs[0].id, ...user.docs[0].data() };
};

export const updateRound = async () => {
  console.log(`========== start updateRound at ${date()} ==========`);
  try {
    const statusRef = firestore.collection('system').doc('round-craw-status');
    const systemRef = firestore.collection('system').doc('main');
    const chainRef = firestore.collection('chains').doc(NETWORK_ID);
    const { willUpdate } = await firestore.runTransaction(async (transaction) => {
      const status = await transaction.get(statusRef);
      const { value } = status.data();
      if (value !== 'idle') return { willUpdate: false };

      transaction.set(statusRef, { value: 'processing' });
      return { willUpdate: true };
    });

    if (!willUpdate) {
      console.log(
        `========== CANCEL start updateRound at ${date()}, has been processing in another process ==========`
      );
      return;
    }

    const workerWallet = getWorkerWallet();
    const gameContract = getGameContract(workerWallet);

    const roundInfo = await gameContract.roundInfo();

    const blockNumber = Number(roundInfo[0].toString());
    const blockTimestamp = Number(roundInfo[1].toString());
    const roundId = roundInfo[2].toString();
    const roundPrize = Number(formatEther(roundInfo[3]));
    const roundEndTime = Number(roundInfo[4].toString()) * 1000;
    const nextRoundPrize = Number(formatEther(roundInfo[5]));
    const roundWinnerBid = Number(formatEther(roundInfo[6]));
    const roundWinner = roundInfo[7];
    const roundSecondBid = Number(formatEther(roundInfo[8]));
    const roundSecondPosition = roundInfo[9];
    const numberOfBids = Number(roundInfo[10].toString());
    const isActive = roundInfo[11];

    const first = roundWinner !== AddressZero ? await getUser(roundWinner.toLowerCase()) : null;
    const second = roundSecondPosition !== AddressZero ? await getUser(roundSecondPosition.toLowerCase()) : null;
    const roundRef = firestore.collection('rounds').doc(roundId);

    const now = Date.now();
    const updatedData = {
      prize: roundPrize,
      nextPrize: nextRoundPrize,
      endTime: admin.firestore.Timestamp.fromMillis(roundEndTime),
      numberOfBids,
      first:
        roundWinner !== AddressZero
          ? {
              address: roundWinner.toLowerCase(),
              amount: roundWinnerBid,
              createdAt: admin.firestore.Timestamp.fromMillis(now),
              username: first ? first.username : null,
            }
          : null,
      second:
        roundSecondPosition !== AddressZero
          ? {
              address: roundSecondPosition.toLowerCase(),
              amount: roundSecondBid,
              createdAt: admin.firestore.Timestamp.fromMillis(now),
              username: second ? second.username : null,
            }
          : null,
      status: isActive ? 'open' : 'closed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await firestore.runTransaction(async (transaction) => {
      transaction.update(statusRef, { value: 'idle' });
      transaction.set(roundRef, updatedData);
      transaction.set(chainRef, { lastBlock: blockNumber });
      if (isActive) {
        transaction.update(systemRef, { activeRoundId: roundId });
      }
    });
  } catch (err) {
    console.error(`========== FAILED updateRound, err ${err.message} ==========`);
    await statusRef.update({ value: 'idle' });
  }
};

export const endGame = async () => {
  const workerWallet = getWorkerWallet();
  const gameContract = getGameContract(workerWallet);

  const tx = await gameContract.endRoundAndCreateNewRound();
  const receipt = await tx.wait();

  if (receipt.status !== 1) throw new Error(`endRoundAndCreateNewRound: transaction failed`);

  const { transactionHash } = receipt;
  const data = {
    transactionHash,
  };
  return data;
};

export const updateWinner = async ({ winner, winnerBid, prize, roundId, transactionHash }) => {
  const users = await firestore.collection('users').where('address', '==', winner).get();
  const user = users.size ? users.docs[0] : null;

  await firestore
    .collection('transactions')
    .doc(transactionHash)
    .set({
      userId: user ? user.id : null,
      address: winner,
      amount: prize,
      type: 'bid-reward',
      roundId,
      bidValue: winnerBid,
      transactionHash,
    });
};

export const checkRoundEnded = async () => {
  console.log(`========== start checkRoundEnded at ${date()} ==========`);

  try {
    const workerWallet = getWorkerWallet();
    const gameContract = getGameContract(workerWallet);

    const roundInfo = await gameContract.roundInfo();
    const roundId = roundInfo[2].toString();
    const roundPrize = Number(formatEther(roundInfo[3]));
    const roundWinnerBid = Number(formatEther(roundInfo[6]));
    const roundWinner = roundInfo[7];
    const isActive = roundInfo[11];

    if (!isActive) {
      const { success, data } = await retry({
        name: 'endRoundAndCreateNewRound',
        action: endGame,
      });
      if (success) {
        if (roundWinner !== AddressZero) {
          await retry({
            name: 'updateWinner',
            action: () =>
              updateWinner({
                winner: roundWinner.toLowerCase(),
                winnerBid: roundWinnerBid,
                roundId,
                prize: roundPrize,
                transactionHash: data.transactionHash,
              }),
          });
        }
        await delay(10000);
        await updateRound();
      }
    }
  } catch (err) {
    console.error(err);
    console.error(`========== FAILED start checkRoundEnded, err ${err.message} ==========`);
  }
};
