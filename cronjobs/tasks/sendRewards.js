import chunk from 'lodash.chunk';
import { parseEther } from '@ethersproject/units';

import { firestore } from '../configs/firebase.config.js';
import { retry } from '../utils/functions.js';
import { getWorkerWallet, getGameContract } from '../services/contract.service.js';
import { date } from '../utils/strings.js';

const distributeRewards = async ({ winners, rewards }) => {
  const workerWallet = getWorkerWallet();
  const gameContract = getGameContract(workerWallet);

  const tx = await gameContract.sendRewards(winners, rewards);

  const receipt = await tx.wait();

  if (receipt.status !== 1) throw new Error(`distributeRewards: transaction failed`);

  const { transactionHash } = receipt;
  const data = {
    transactionHash,
  };

  return data;
};

const distributeRoundRewards = async (txns) => {
  const allChunkedTxns = chunk(txns, 50);

  for (const chunkedTxns of allChunkedTxns) {
    const roundId = chunkedTxns[0].roundId;
    const txnIds = chunkedTxns.map((txn) => txn.id);
    const winners = chunkedTxns.map((txn) => txn.address);
    const rewards = chunkedTxns.map((txn) => parseEther(`${txn.value}`));

    console.log(`========== distributeRoundRewards, round ${roundId}, ${date()} ==========`);
    try {
      const { valid, reason } = await firestore.runTransaction(async (transaction) => {
        for (const txnId of txnIds) {
          const txnRef = firestore.collection('transactions').doc(txnId);
          const txn = await transaction.get(txnRef);
          const { status } = txn.data();

          if (status !== 'unprocessed') return { valid: false, reason: 'processing' };
        }

        for (const txnId of txnIds) {
          const txnRef = firestore.collection('transactions').doc(txnId);
          transaction.update(txnRef, { status: 'processing' });
        }

        return { valid: true, reason: '' };
      });

      console.log(
        `========== distributeRoundRewards, round ${roundId}, ${date()}, valid ${valid}, reason ${reason} ==========`
      );

      if (valid) {
        const { success, data } = await retry({
          name: 'distributeRewards',
          action: () => distributeRewards({ winners, rewards }),
        });

        if (success) {
          const batch = firestore.batch();

          txnIds.map((txnId) => {
            const txnRef = firestore.collection('transactions').doc(txnId);
            batch.update(txnRef, { status: 'success', transactionHash: data.transactionHash });
          });

          await batch.commit();
          console.log(`========== SUCCESS distributeRoundRewards, round ${roundId}, ${date()} ==========`);
        } else {
          throw new Error('distributeRewards failed');
        }
      }
    } catch (err) {
      console.error(err);
      console.log(`========== ERROR distributeRoundRewards, round ${roundId}, ${date()}, ${err.message} ==========`);

      const batch = firestore.batch();

      txnIds.map((txnId) => {
        const txnRef = firestore.collection('transactions').doc(txnId);
        batch.update(txnRef, { status: 'unprocessed' });
      });

      await batch.commit();
    }
  }
};

const sendRewards = async () => {
  try {
    console.log(`========== sendRewards, ${date()} ==========`);
    const snapshot = await firestore
      .collection('transactions')
      .where('type', '==', 'win')
      .where('status', '==', 'unprocessed')
      .get();

    const results = snapshot.docs.reduce((res, doc) => {
      const { roundId, value, userId, address } = doc.data();
      return {
        ...res,
        [roundId]: [...(res[roundId] || []), { id: doc.id, roundId, value, userId, address }],
      };
    }, {});

    console.log(`========== sendRewards, ${date()}, ${JSON.stringify(results)} ==========`);

    for (const value of Object.values(results)) {
      await distributeRoundRewards(value);
    }
    console.log(`========== COMPLETED sendRewards, ${date()} ==========`);
  } catch (err) {
    console.error(err);
    console.log(`========== ERROR sendRewards, ${date()}, ${err.message} ==========`);
  }
};

export default sendRewards;
