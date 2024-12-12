import { formatEther } from '@ethersproject/units';
import { AddressZero } from '@ethersproject/constants';

import admin, { firestore } from '../configs/firebase.config.js';
import { getWorkerWallet, getGameContract } from './contract.service.js';
import { date } from '../utils/strings.js';
import environments from '../utils/environments.js';

const { NETWORK_ID } = environments;

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
    console.log(`========== SUCCESS updateRound at ${date()} ==========`);
  } catch (err) {
    console.error(`========== FAILED updateRound, err ${err.message} ==========`);
    await statusRef.update({ value: 'idle' });
  }
};
