import { parseBytes32String } from '@ethersproject/strings';

import admin, { firestore } from '../configs/firebase.config.js';
import { getUserDetail } from './api.service.js';
import quickNode from '../configs/quicknode.config.js';
import { decodeGameTxnLogs } from './contract.service.js';
import environments from '../utils/environments.js';

const { GAME_ADDRESS } = environments;

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

  const phoneAccount = linkedAccounts.find(
    (account) => account.type === 'phone'
  );
  if (!phoneAccount) throw new Error('API error: Bad request');

  const { details } = phoneAccount;
  await firestore
    .collection('users')
    .doc(userId)
    .update({ phone: details.phone });

  return details.phone;
};

export const getMe = async (userId) => {
  const user = await firestore.collection('users').doc(userId).get();

  return { id: user.id, ...user.data() };
};

export const validateGameTransaction = async ({ userId, transactionHash }) => {
  const user = await firestore.collection('users').doc(userId).get();
  const { address } = user.data();

  const receipt = await quickNode.waitForTransaction(transactionHash);
  const { from, to, status, logs } = receipt;
  if (status !== 1) throw new Error('API error: Invalid txn status');
  if (to.toLowerCase() !== GAME_ADDRESS.toLowerCase())
    throw new error('API error: Bad credential');
  if (from.toLowerCase() !== address.toLowerCase())
    throw new Error('API error: Bad credential');

  const decodedData = decodeGameTxnLogs('Subscribed', logs[logs.length - 1]);

  const userAddress = decodedData.addr;
  const planId = parseBytes32String(decodedData.planId);
  if (userAddress.toLowerCase() !== address.toLowerCase())
    throw new Error('API error: Bad credential');

  const plan = await firestore.collection('plans').doc(planId).get();
  const { days } = plan.data();
  const now = Date.now();
  const expireTimeUnix = now + days * 24 * 60 * 60 * 1000;
  await firestore
    .collection('user-plans')
    .doc(userId)
    .set({
      plan: { planId: plan.id, ...plan.data() },
      startTime: admin.firestore.Timestamp.fromMillis(now),
      expireTime: admin.firestore.Timestamp.fromMillis(expireTimeUnix),
      trialUsed: true,
    });
};
