import { formatEther } from '@ethersproject/units';

import admin, { firestore } from '../configs/firebase.config.js';
import { getUserDetail } from './api.service.js';
import quickNode from '../configs/quicknode.config.js';
import { decodeGameTxnLogs } from './contract.service.js';
import { updateRound } from './round.service.js';
import { date } from '../utils/strings.js';
import environments from '../utils/environments.js';

const { DOLLAR_AUCTION_ADDRESS } = environments;

export const createUserIfNotExist = async (data) => {
  const { userId, address, email, name, avatar } = data;
  const userRef = firestore.collection('users').doc(address);
  const pointRef = firestore.collection('points').doc(address);
  const userPlanRef = firestore.collection('user-plans').doc(address);
  const activityRef = firestore.collection('activities').doc();

  await firestore.runTransaction(async (transaction) => {
    const user = await transaction.get(userRef);

    if (user.exists) return;

    transaction.set(userRef, {
      externalId: userId,
      address,
      email,
      name,
      avatar,
      phone: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.set(pointRef, { point: 0, rank: '-' });
    transaction.set(userPlanRef, {
      trialUsed: false,
      plan: null,
      startTime: null,
      expireTime: null,
    });
    transaction.set(activityRef, {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userId: address,
      user: { userId: address, name, email, avatar },
      type: 'new-account',
      metadata: {},
    });
  });

  return data;
};

export const validatePhoneNumber = async ({ userId }) => {
  const user = await firestore.collection('users').doc(userId).get();
  const { phone } = user.data();
  if (phone) return;

  const res = await getUserDetail(userId);
  const userData = res.data[0];
  const { linkedAccounts } = userData;

  const phoneAccount = linkedAccounts.find((account) => account.type === 'phone');
  if (!phoneAccount) throw new Error('API error: Bad request');

  const { details } = phoneAccount;
  await firestore.collection('users').doc(userId).update({ phone: details.phone });

  return details.phone;
};

export const getMe = async (userId) => {
  const user = await firestore.collection('users').doc(userId).get();

  return { id: user.id, ...user.data() };
};

export const validateGameTransaction = async ({ transactionHash }) => {
  console.log(`========== validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
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
    if (to.toLowerCase() !== DOLLAR_AUCTION_ADDRESS.toLowerCase()) throw new error('API error: Bad credential');

    const decodedData = decodeGameTxnLogs('BidCreated', logs[logs.length - 1]);
    const { roundId, bidder, amount } = decodedData;

    let refundAmount;
    let refundUser;
    const hasRefund = logs.length === 4;
    if (hasRefund) {
      const decodedData = decodeGameTxnLogs('Refund', logs[logs.length - 2]);
      const { to, amount } = decodedData;
      const refundUserRef = firestore.collection('users').where('address', '==', to.toLowerCase()).limit(1);
      refundUser = await transaction.get(refundUserRef);
      refundAmount = Number(formatEther(`${amount}`));
    }

    const userRef = firestore.collection('users').where('address', '==', bidder.toLowerCase()).limit(1);
    const user = await transaction.get(userRef);
    if (!user.empty) {
      transaction.set(txRef, {
        userId: user.docs[0].id,
        address: bidder.toLowerCase(),
        type: 'bid',
        roundId: roundId.toString(),
        amount: Number(formatEther(`${amount}`)),
        transactionHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    if (refundUser && !refundUser?.empty) {
      const refundTxnRef = firestore.collection('transactions').doc(`${transactionHash}-refund`);
      transaction.set(refundTxnRef, {
        userId: refundUser.docs[0].id,
        address: refundUser.docs[0].data().address,
        type: 'refund',
        roundId: roundId.toString(),
        amount: refundAmount,
        transactionHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

  console.log(`========== SUCCESS validateGameTransaction at ${date()}, transactionHash ${transactionHash} ==========`);
  updateRound();
};
