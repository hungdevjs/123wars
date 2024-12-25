import { formatEther, parseEther } from '@ethersproject/units';
import { AddressZero } from '@ethersproject/constants';
import { ethers } from 'ethers';
import chunk from 'lodash.chunk';

import admin, { firestore } from '../configs/firebase.config.js';
import {
  getAdminWallet,
  getWorkerWallet,
  getSignerWallet,
  getGameContract,
  decodeGameTxnLogs,
} from './contract.service.js';
import { date } from '../utils/strings.js';
import { retry } from '../utils/functions.js';
import quickNode from '../configs/quicknode.config.js';
import configs from '../configs/game.config.js';
import environments from '../utils/environments.js';

const { NETWORK_ID } = environments;

const { lockTime, openTime } = configs;

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

    const adminWallet = getAdminWallet();
    const gameContract = await getGameContract(adminWallet);

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

export const getActiveRoundId = async () => {
  const system = await firestore.collection('system').doc('main').get();

  return system.data().activeRoundId;
};

export const getActiveRound = async () => {
  const activeRoundId = await getActiveRoundId();
  const snapshot = await firestore.collection('rounds').doc(activeRoundId).get();

  return { id: snapshot.id, ...snapshot.data() };
};

export const create = async () => {
  const activeRoundId = await getActiveRoundId();
  const roundId = `${Number(activeRoundId) + 1}`;

  const now = Date.now();
  const batch = firestore.batch();

  const roundRef = firestore.collection('rounds').doc(roundId);
  const systemRef = firestore.collection('system').doc('main');

  batch.set(roundRef, {
    status: 'open',
    createdAt: admin.firestore.Timestamp.fromMillis(now),
    lockTime: admin.firestore.Timestamp.fromMillis(now + openTime),
    startTime: admin.firestore.Timestamp.fromMillis(now + openTime + lockTime),
  });

  batch.update(systemRef, { activeRoundId: roundId });

  await batch.commit();
};

export const lock = async ({ roundId }) => {
  await firestore.collection('rounds').doc(roundId).update({ status: 'locked' });
};

export const start = async ({ roundId }) => {
  await firestore.collection('rounds').doc(roundId).update({ status: 'processing' });
};

export const end = async ({ roundId, winner }) => {
  const batch = firestore.batch();

  const roundRef = firestore.collection('rounds').doc(roundId);
  const systemRef = firestore.collection('system').doc('winners');

  const roundData = { status: 'closed', winner, endedAt: admin.firestore.FieldValue.serverTimestamp() };
  const systemData = { [winner]: admin.firestore.FieldValue.increment(1) };

  batch.update(roundRef, roundData);
  batch.set(systemRef, systemData, { merge: true });

  const roundBettings = await firestore
    .collection('transactions')
    .where('roundId', '==', roundId)
    .where('type', '==', 'bet')
    .where('status', '==', 'success')
    .get();

  roundBettings.docs
    .filter((doc) => doc.data().option === winner)
    .map((doc) => {
      const { userId, address, value, option } = doc.data();

      const rewardTxnRef = firestore.collection('transactions').doc();
      batch.set(rewardTxnRef, {
        roundId,
        userId,
        address,
        value: value * 3,
        type: 'win',
        option,
        transactionHash: '',
        status: 'unprocessed',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

  await batch.commit();
};

export const generateBetSignature = async ({ userId, value, option }) => {
  const activeRound = await getActiveRound();
  if (activeRound.status !== 'open') throw new Error('API error: Round is locked');

  const options = {
    rock: 1,
    paper: 2,
    scissors: 3,
  };

  const user = await firestore.collection('users').doc(userId).get();
  const { address } = user.data();

  const roundId = Number(activeRound.id);
  const time = Math.floor(Date.now() / 1000);
  const types = ['address', 'uint256', 'uint256', 'uint256', 'uint256'];
  const values = [address, roundId, options[option], parseEther(value.toString()).toString(), time];

  const message = ethers.solidityPackedKeccak256(types, values);

  const signerWallet = getSignerWallet();
  const signature = await signerWallet.signMessage(ethers.toBeArray(message));
  return { address, roundId, option: options[option], value, time, signature };
};

export const validateGameTransaction = async ({ transactionHash }) => {
  console.log(`========== validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
  const system = await firestore.collection('system').doc('main').get();
  const { addresses } = system.data();

  const txRef = firestore.collection('transactions').doc(transactionHash);
  await firestore.runTransaction(async (transaction) => {
    const tx = await transaction.get(txRef);
    if (tx.exists) {
      console.log(
        `========== CANCEL validateGameTransaction, transaction ${transactionHash} is already processed ==========`
      );
      return;
    }

    const receipt = await quickNode.waitForTransaction(transactionHash);
    const { to, status, logs } = receipt;
    if (status !== 1) throw new Error('API error: Invalid txn status');
    if (to.toLowerCase() !== addresses.game.toLowerCase()) throw new Error('API error: Bad credential');

    const decodedData = await decodeGameTxnLogs('BetCreated', logs[logs.length - 1]);
    const { roundId, option, from, value } = decodedData;

    const options = {
      1: 'rock',
      2: 'paper',
      3: 'scissors',
    };

    const userOption = options[option.toString()];
    const userValue = Number(formatEther(`${value}`));

    const userRef = firestore.collection('users').where('address', '==', from.toLowerCase()).limit(1);
    const user = await transaction.get(userRef);
    if (!user.empty) {
      transaction.set(txRef, {
        userId: user.docs[0].id,
        address: from.toLowerCase(),
        type: 'bet',
        roundId: roundId.toString(),
        option: userOption,
        value: userValue,
        transactionHash,
        status: 'success',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const roundRef = firestore.collection('rounds').doc(roundId.toString());
    const countKey = `bettings.${userOption}.count`;
    const valueKey = `bettings.${userOption}.value`;
    transaction.update(roundRef, {
      [countKey]: admin.firestore.FieldValue.increment(1),
      [valueKey]: admin.firestore.FieldValue.increment(userValue),
    });
  });

  console.log(`========== SUCCESS validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
};

const distributeRewards = async ({ winners, rewards }) => {
  const workerWallet = getWorkerWallet();
  const gameContract = await getGameContract(workerWallet);

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

export const sendRewards = async ({ roundId }) => {
  try {
    console.log(`========== sendRewards, ${date()} ==========`);
    const snapshot = await firestore
      .collection('transactions')
      .where('roundId', '==', roundId)
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
